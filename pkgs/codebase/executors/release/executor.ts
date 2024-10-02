import { type ExecutorContext } from "@nx/devkit";
import { getDependencies, getExecutor, uploadRelease } from "@codebase/devkit";
import fs from "fs";
import yaml from "js-yaml";
interface ExecutorOptions {
  verbose?: boolean;
  rebuild?: boolean;
  buildNum?: number;
  branch?: "debug" | "develop" | "main";
  local?: boolean;
}

export default async function executor(
  { rebuild, buildNum, branch, local = true }: ExecutorOptions,
  context: ExecutorContext
): Promise<{ success: boolean }> {
  if (!buildNum || !branch)
    throw new Error("buildNum and branch are required. e.g. nx release --buildNum=1 --branch=main");
  const { workspaceRoot, projectRoot, projectName, runInWorkspace, runTask } = getExecutor(context);
  const { libDeps } = await getDependencies(projectName);

  // 1. 1. Initialize release root
  const distRoot = `${workspaceRoot}/dist/apps/${projectName}`;
  const buildRoot = `${workspaceRoot}/releases/builds/${projectName}`;
  const appVersionFilePath = `${projectRoot}/config.yaml`;
  const appVersionInfo = yaml.load(fs.readFileSync(appVersionFilePath, "utf-8")) as {
    platforms: { android: { versionName: string } };
  };
  const platformVersion = appVersionInfo.platforms.android.versionName;

  if (fs.existsSync(buildRoot)) fs.rmSync(buildRoot, { recursive: true, force: true });
  fs.mkdirSync(buildRoot, { recursive: true });
  if (!!rebuild || !fs.existsSync(`${distRoot}/backend`)) runInWorkspace(`npx nx build-backend ${projectName}`);
  if (!!rebuild || !fs.existsSync(`${distRoot}/frontend`)) runInWorkspace(`npx nx build-frontend ${projectName}`);
  // 1. 2. Release dist files
  fs.cpSync(distRoot, buildRoot, { recursive: true });

  fs.rmSync(`${buildRoot}/frontend/.next`, { recursive: true, force: true });
  // 1. 3. Compress release files
  runInWorkspace(`tar -zcf ${workspaceRoot}/releases/builds/${projectName}-release.tar.gz -C ${buildRoot} ./`);
  if (fs.existsSync(`${distRoot}/csr`)) {
    //* 여기 바꿀라면 고석현을 한 번 부르세요.
    //! zip 명령어는 압축시 폴더 경로를 무시하는 게 안됨
    //! 두 가지 방법이 있음
    //! 1. 경로로 이동 후 압축
    //! 2. csr폴더를 현 위치로 복사 후 압축 후 삭제
    //! execSync를 가져오기 싫으니 일단 2번 방법으로 해보자
    fs.cpSync(`${distRoot}/csr`, "./csr", { recursive: true });
    runInWorkspace(`zip -r ${workspaceRoot}/releases/builds/${projectName}-appBuild.zip  ./csr`);
    fs.rmSync("./csr", { recursive: true, force: true });
  }

  // 2. 1. Initialize source root
  const sourceRoot = `${workspaceRoot}/releases/sources/${projectName}`;
  if (fs.existsSync(sourceRoot)) {
    const MAX_RETRY = 3;
    for (let i = 0; i < MAX_RETRY; i++) {
      try {
        fs.rmSync(sourceRoot, { recursive: true, force: true });
      } catch (e) {
        //
      }
    }
  }
  fs.mkdirSync(sourceRoot, { recursive: true });

  // 2. 2. Release source files
  fs.cpSync(projectRoot, `${sourceRoot}/apps/${projectName}`, { recursive: true });
  libDeps.forEach((lib) => {
    fs.cpSync(`${workspaceRoot}/libs/${lib}`, `${sourceRoot}/libs/${lib}`, { recursive: true });
  });
  fs.cpSync(`${workspaceRoot}/pkgs/codebase`, `${sourceRoot}/pkgs/codebase`, { recursive: true });
  [".next", "ios", "android", "public/libs"].forEach((path) => {
    const targetPath = `${sourceRoot}/apps/${projectName}/${path}`;
    if (fs.existsSync(targetPath)) fs.rmSync(targetPath, { recursive: true, force: true });
  });
  ["artifacts", "cache", "env.ts"].forEach((path) => {
    const targetPath = `${sourceRoot}/pkgs/contract/${path}`;
    if (fs.existsSync(targetPath)) fs.rmSync(targetPath, { recursive: true, force: true });
  });

  // 2. 3. Sync common files
  const syncPaths = [
    ".husky",
    ".vscode",
    ".editorconfig",
    ".eslintrc.json",
    ".gitignore",
    ".prettierignore",
    ".prettierrc.json",
    ".swcrc",
    "jest.config.ts",
    "nx.json",
    "pnpm-workspace.yaml",
    "package.json",
  ];
  syncPaths.forEach((path) => {
    fs.cpSync(`${workspaceRoot}/${path}`, `${sourceRoot}/${path}`, { recursive: true });
  });

  // 2. 4. Sync tsconfig.json
  const tsconfig = JSON.parse(fs.readFileSync(`${workspaceRoot}/tsconfig.json`, "utf8")) as {
    compilerOptions: { paths: Record<string, string[]> };
  };
  tsconfig.compilerOptions.paths = Object.fromEntries([
    [`@${projectName}/*`, [`apps/${projectName}/*`]],
    ...["codebase", ...libDeps].reduce(
      (acc, lib) => [...acc, [`@${lib}`, [`libs/${lib}/index.ts`]], [`@${lib}/*`, [`libs/${lib}/*`]]],
      []
    ),
  ]) as Record<string, string[]>;
  fs.writeFileSync(`${sourceRoot}/tsconfig.json`, JSON.stringify(tsconfig, null, 2));

  // 2. 5. Write README.md
  fs.writeFileSync(
    `${sourceRoot}/README.md`,
    `# ${projectName}
  본 프로젝트의 소스코드 및 관련자료는 모두 비밀정보로 관리됩니다.

  ## Get Started
  Run the code below.
  \`\`\`
  npm i -g nx pnpm
  pnpm i -w

  cat <<EOF >> .env
  # ENV For Server => debug | debug.local | develop | develop.local | main | main.local
  SERVER_ENV=debug.local
  # Run Mode For Server => federation | batch | all
  SERVER_MODE=federation
  # ENV For Client => debug | debug.local | develop | develop.local | main | main.local
  NEXT_PUBLIC_CLIENT_ENV=debug.local
  ANALYZE=false
  EOF

  nx serve-backend ${projectName}
  # or nx serve-frontend ${projectName}, etc
  \`\`\`

  ## Build
  Run the code below.
  \`\`\`
  nx build-backend ${projectName}
  # or nx build-frontend ${projectName}, etc
  \`\`\`
  `
  );

  // 2. 6. Compress source files
  runInWorkspace(`tar -zcf ${workspaceRoot}/releases/sources/${projectName}-source.tar.gz -C ${sourceRoot} ./`);

  // 3. Register release and source files
  await uploadRelease(projectName, { workspaceRoot, branch, buildNum, platformVersion, local });

  return { success: true };
}
