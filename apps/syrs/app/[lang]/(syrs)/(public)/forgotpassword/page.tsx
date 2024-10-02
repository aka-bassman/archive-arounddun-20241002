import { Image, Link } from "@util/ui";
import { Keyring } from "@shared/client";

export default function Page() {
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <div className="z-10 md:w-[400px] px-12 pt-12 pb-4 shadow-lg rounded-xl bg-base-100/50 backdrop-blur-sm">
        <Keyring.Util.ForgotPassword />
        <Link.Back className="text-center">
          <button className="mt-2 underline btn btn-ghost">Back</button>
        </Link.Back>
      </div>
      <Image className="absolute left-0 right-0 top-0 bottom-0 -z-50" width={1920} height={1080} src="/back.jpg" />
    </div>
  );
}
