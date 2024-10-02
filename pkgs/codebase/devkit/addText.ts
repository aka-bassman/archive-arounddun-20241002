import type { Tree } from "@nx/devkit";

interface EditForm {
  type: "before" | "after";
  text: string;
  jumpline?: boolean;
  signal?: string;
  ifNotIncludes?: string;
}

export const addText = (tree: Tree, path: string, { type, text, signal, ifNotIncludes, jumpline = true }: EditForm) => {
  if (ifNotIncludes && tree.read(path, "utf-8")?.includes(ifNotIncludes)) return;
  const content = tree.read(path, "utf-8");
  if (!content || content.includes(text)) return;
  if (signal) {
    type === "before"
      ? tree.write(path, content.replace(signal, `${text}${jumpline ? "\n" : ""}${signal}`))
      : tree.write(path, content.replace(signal, `${signal}${jumpline ? "\n" : ""}${text}`));
  } else {
    tree.write(
      path,
      type === "before"
        ? `${text}${jumpline ? "\n" : ""}${tree.read(path, "utf-8")}`
        : `${tree.read(path, "utf-8")}${jumpline ? "\n" : ""}${text}`
    );
  }
};
