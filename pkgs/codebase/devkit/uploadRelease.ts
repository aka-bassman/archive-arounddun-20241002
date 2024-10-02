import FormData from "form-data";
import axios from "axios";
import fs from "fs";

export const uploadRelease = async (
  projectName: string,
  {
    workspaceRoot,
    branch,
    buildNum,
    platformVersion,
    local,
  }: {
    workspaceRoot: string;
    branch: "debug" | "develop" | "main";
    buildNum: number;
    platformVersion?: string;
    local?: boolean;
  }
) => {
  const basePath = local ? "http://localhost:8080/backend" : "https://akasys.akamir.com/backend";
  const buildPath = `${workspaceRoot}/releases/builds/${projectName}-release.tar.gz`;
  const appBuildPath = `${workspaceRoot}/releases/builds/${projectName}-appBuild.zip`;
  const sourcePath = `${workspaceRoot}/releases/sources/${projectName}-source.tar.gz`;
  const formData = new FormData();
  const build = fs.readFileSync(buildPath);
  const source = fs.readFileSync(sourcePath);
  const appBuild = fs.readFileSync(appBuildPath);
  const buildStat = fs.statSync(buildPath);
  const sourceStat = fs.statSync(sourcePath);
  const appBuildStat = fs.statSync(appBuildPath);
  formData.append("files", build, `${projectName}-release.tar.gz`);
  formData.append("files", source, `${projectName}-source.tar.gz`);
  formData.append("files", appBuild, `${projectName}-appBuild.zip`);
  formData.append(
    "metas",
    JSON.stringify([
      { lastModifiedAt: buildStat.mtime, size: buildStat.size },
      { lastModifiedAt: sourceStat.mtime, size: sourceStat.size },
      { lastModifiedAt: appBuildStat.mtime, size: appBuildStat.size },
    ])
  );
  formData.append("type", "release");
  try {
    const [buildFile, sourceFile, appBuildFile] = (
      await axios.post<[{ id: string }, { id: string }, { id: string }]>(`${basePath}/file/addFilesRestApi`, formData)
    ).data;

    const major = platformVersion ? parseInt(platformVersion.split(".")[0]) : 1;
    const minor = platformVersion ? parseInt(platformVersion.split(".")[1]) : 0;
    const patch = platformVersion ? parseInt(platformVersion.split(".")[2]) : 0;
    const latestRelease = await axios.get(
      `${basePath}/release/findVersionRelease?appName=${projectName}&branch=${branch}&major=${major}&minor=${minor}`
    );

    //코드푸시일 경우(latestRelease가 있을 경우) patch버전을 1 올린다.
    const release = (
      await axios.post<{ id: string }>(
        `${basePath}/release/pushRelease/${projectName}/${branch}/${major}/${minor}/${sourceFile.id}/${buildFile.id}/${appBuildFile.id}`
      )
    ).data;
    return release;
  } catch (e) {
    return null;
  }
};
