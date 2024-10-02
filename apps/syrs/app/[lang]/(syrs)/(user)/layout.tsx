import { TopBanner } from "@syrs/ui";

export default function Layout({ children }: any) {
  // getSelf({ unauthorize: "/signin" });
  return (
    <div className=" min-h-[calc(100dvh)] bg-paper-bg bg-contain ">
      <div className="w-full pt-10 px-10 container flex flex-col gap-2 items-center whitespace-pre-wrap ">
        <TopBanner />
        <div className="w-full h-full">{children}</div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
