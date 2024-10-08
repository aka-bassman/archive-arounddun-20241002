import { TopBanner } from "@syrs/ui";

export default function Layout({ children }: any) {
  return (
    <div className="bg-syrs-bg h-auto">
      <div className="w-full min-h-[calc(100dvh)] sm:pt-10 pt-6  px-6 container flex flex-col gap-2 items-center">
        <TopBanner />
        {children}
      </div>
      {/* <Footer /> */}
    </div>
  );
}
