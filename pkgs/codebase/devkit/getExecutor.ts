import { ExecutorContext, logger, runExecutor } from "@nx/devkit";
import { execSync, spawn } from "child_process";

export const getExecutor = (context: ExecutorContext) => {
  const workspaceRoot = context.root;
  const projectRoot = context.projectsConfigurations?.projects[context.projectName ?? ""].root;
  const projectName = context.projectName;
  if (!projectRoot) throw new Error("No project root found");
  else if (!projectName) throw new Error("No project name found");
  const runInProject = (command: string) => {
    execSync(command, { cwd: projectRoot, stdio: "inherit" });
  };
  const runInWorkspace = (command: string) => {
    execSync(command, { cwd: workspaceRoot, stdio: "inherit" });
  };
  const spawnInProject = async (command: string, args: string[]) => {
    const proc = spawn(command, args, { cwd: projectRoot, stdio: "inherit" });
    proc.stderr?.on("data", (data: string) => {
      logger.error(data.toString());
    });
    return new Promise((resolve, reject) => {
      proc.on("exit", (code, signal) => {
        if (!!code || signal) reject(`code: ${code}, signal: ${signal}`);
        else resolve(`code: ${code}, signal: ${signal}`);
      });
    });
  };
  const spawnInWorkspace = async (command: string, args: string[]) => {
    const proc = spawn(command, args, { cwd: workspaceRoot, stdio: "inherit" });
    proc.stderr?.on("data", (data: string) => {
      logger.error(data.toString());
    });
    return new Promise((resolve, reject) => {
      proc.on("exit", (code, signal) => {
        if (!!code || signal) reject(`code: ${code}, signal: ${signal}`);
        else resolve(`code: ${code}, signal: ${signal}`);
      });
    });
  };
  const runTask = async (target: string, configuration?: "development" | "production") => {
    for await (const s of await runExecutor({ project: projectName, target, configuration }, {}, context)) {
      if (!s.success) throw new Error(`Failed to run ${target} task`);
    }
  };
  return {
    runInProject,
    runInWorkspace,
    spawnInProject,
    spawnInWorkspace,
    runTask,
    projectRoot,
    projectName,
    workspaceRoot,
  };
};
