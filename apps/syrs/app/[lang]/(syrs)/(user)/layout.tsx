import { getSelf } from "@core/client";
import { TopBanner } from "@syrs/ui";

export default function Layout({ children }: any) {
  // getSelf({ unauthorize: "/signin" });
  const self = getSelf({ unauthorize: "/signin" });
  return (
    // <div className=" min-h-[calc(100dvh)] bg-contain ">
    //   <div className="w-full pt-10 px-10 container flex flex-col gap-2 items-center whitespace-pre-wrap ">
    <div className="bg-syrs-bg min-h-[calc(100dvh)]">
      <div className="container flex w-full flex-col items-center gap-2 whitespace-pre-wrap px-10 pt-10 ">
        <TopBanner />
        <div className="w-full h-full">{children}</div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
