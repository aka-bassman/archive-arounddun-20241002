import { ProjectGraphDependency, createProjectGraphAsync } from "@nx/devkit";

interface AddLibDepSetParams {
  libDepSet: Set<string>;
  npmDepSet: Set<string>;
  dependencies: Record<string, ProjectGraphDependency[]>;
}
const addLibDepSet = (depName: string, { libDepSet, npmDepSet, dependencies }: AddLibDepSetParams) => {
  const deps = dependencies[depName] as ProjectGraphDependency[] | undefined;
  if (!deps) throw new Error(`No dependencies found for project or library ${depName}`);
  for (const dep of deps) {
    if (dep.target.startsWith("npm:")) npmDepSet.add(dep.target);
    else if (libDepSet.has(dep.target)) continue;
    else {
      libDepSet.add(dep.target);
      addLibDepSet(dep.target, { libDepSet, npmDepSet, dependencies });
    }
  }
};

export const getDependencies = async (projectName: string) => {
  const graph = await createProjectGraphAsync();
  const [libDepSet, npmDepSet] = [new Set<string>(), new Set<string>()];
  const dependencies = graph.dependencies;
  const projectDeps = dependencies[projectName] as ProjectGraphDependency[] | undefined;
  if (!projectDeps) throw new Error(`No dependencies found for project ${projectName}`);
  addLibDepSet(projectName, { libDepSet, npmDepSet, dependencies });
  return {
    libDeps: [...libDepSet.values()],
    npmDeps: [...npmDepSet.values()].map((depName) => depName.replace("npm:", "")),
  };
};
