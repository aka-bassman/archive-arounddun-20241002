const fileSuffixSet = new Set([
  "page.tsx",
  "layout.tsx",
  "index.ts",
  "cnst_.ts",
  "cnst.ts",
  "db.ts",
  "dict.ts",
  "fetch.ts",
  "option.ts",
  "sig.ts",
  "srv.ts",
  "st.ts",
  "usePage.ts",
  "_server.ts",
  "constant.ts",
  "dictionary.ts",
  "document.ts",
  "service.ts",
  "signal.ts",
  "spec.ts",
  "test.ts",
  "store.ts",
  "Template.tsx",
  "Unit.tsx",
  "Util.tsx",
  "View.tsx",
  "Zone.tsx",
  "index.tsx",
]);
export const fileIsPureImportFile = (filename: string) => {
  const suffixFilename = filename.split("/").at(-1)?.split(".").slice(-2).join(".") ?? "";
  if (fileSuffixSet.has(suffixFilename)) return true;
  else return false;
};
