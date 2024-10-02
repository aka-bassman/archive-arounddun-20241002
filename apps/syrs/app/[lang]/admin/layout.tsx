import { System } from "@shared/ui";
import { env } from "@syrs/env/env.client";
import { fetch } from "@syrs/client";
import type { RootLayoutProps } from "@core/client";

export const metadata = { title: "Puffin Place" };

export default function Layout({ children, params: { lang } }: RootLayoutProps) {
  return (
    <System.Provider
      appName="syrs"
      lang={lang}
      head={<link rel="icon" href="/favicon.ico" />}
      // className="bg-base-100"
      env={env}
      fetch={fetch}
    >
      {children}
    </System.Provider>
  );
}
