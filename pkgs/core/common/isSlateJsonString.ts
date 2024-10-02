export const isSlateJsonString = (str: string) => {
  try {
    const obj = JSON.parse(str) as object;
    return isSlateObject(obj);
  } catch (e) {
    return false;
  }
};

const isSlateObject = (obj: object) => {
  if (!Array.isArray(obj)) return false;

  return obj.every((node: { children: any } | null) => {
    if (typeof node !== "object" || node === null) return false;
    if (!Array.isArray(node.children)) return false;
    return "text" in node || ("type" in node && "children" in node);
  });
};
