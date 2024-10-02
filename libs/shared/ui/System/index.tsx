import { default as CSR, type CSRProviderProps } from "./CSR";
import { Root } from "./Root";
import { default as SSR, type SSRProviderProps } from "./SSR";
import { SelectLanguage } from "./SelectLanguage";
import { ThemeToggle } from "./ThemeToggle";
import { baseClientEnv } from "@core/base";

export const Provider = (props: CSRProviderProps | SSRProviderProps) => {
  if (baseClientEnv.renderMode === "csr") return <CSR {...(props as CSRProviderProps)} />;
  else return <SSR {...(props as SSRProviderProps)} />;
};
export const System = {
  Provider,
  ThemeToggle,
  Root,
  SelectLanguage,
};
