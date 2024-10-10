import { type RootLayoutProps, loadFonts } from "@core/client";
import { System } from "@shared/ui";
import { env } from "@syrs/env/env.client";
import { fetch } from "@syrs/client";
import localFont from "next/font/local";

export const metadata = { title: "Syrs AI Lab", manifest: "/manifest.json" };

const gilda = localFont({
  src: "../../../public/libs/shared/fonts/GildaDisplay-Regular.ttf",
  weight: "400",
  variable: "--font-gilda",
});

const fonts = loadFonts([
  {
    name: "gilda",
    nextFont: gilda,
    paths: [{ src: "/libs/shared/fonts/GildaDisplay-Regular.ttf", weight: 500 }],
  },
]);

export default function Layout({ children, params: { lang } }: RootLayoutProps) {
  return (
    <System.Provider
      appName="syrs"
      lang={lang}
      head={<></>}
      className=" bg-syrs-bg"
      env={env}
      fetch={fetch}
      fonts={fonts}
    >
      {children}
    </System.Provider>
  );
}
