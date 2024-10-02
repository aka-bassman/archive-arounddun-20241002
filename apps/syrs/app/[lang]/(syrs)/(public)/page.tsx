import { Link } from "@util/ui";
import { getSelf, router } from "@core/client";
export default function Page() {
  const self = getSelf();
  if (!self) {
    router.redirect("/signin");
  }
  return (
    <div className="relative w-full flex-grow overflow-hidden flex items-center justify-center">
      <div className="max-w-md bg-base-100/50 shadow-lg rounded-xl backdrop-blur-sm w-full py-8 px-16 flex flex-col items-center justify-center gap-3">
        <h1 className="text-4xl mt-2">syrs</h1>
        <h2 className="text-lg">syrs description</h2>
        <Link className="w-full" href={self ? "/admin" : "/signin"}>
          <button className="btn w-full btn-primary">Go to dashboard</button>
        </Link>
        <Link className="w-full" href={self ? "/test" : "/signin"}>
          <button className="btn w-full btn-primary">test</button>
        </Link>
      </div>
    </div>
  );
}
