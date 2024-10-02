import { Image } from "@util/ui";
import { Keyring } from "@shared/client";
import { env } from "@syrs/env/env.client";
import { getSelf, router } from "@core/client";

export default function Page() {
  const self = getSelf();
  if (self) router.redirect("/");
  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      <Image
        className="absolute left-0 right-0 top-0 bottom-0 w-full h-screen -z-50"
        width={1920}
        height={1080}
        src="/back.jpg"
      />
      <div className="max-w-md bg-base-100/50 shadow-lg rounded-xl backdrop-blur-sm w-full py-4 pb-10 px-16">
        <div className="my-6 flex justify-center text-4xl">syrs</div>
        <Keyring.Util.SignInPassword siteKey={env.cloudflare.siteKey} loginForm={{ redirect: "/" }} signupHref={null} />
      </div>
    </div>
  );
}
