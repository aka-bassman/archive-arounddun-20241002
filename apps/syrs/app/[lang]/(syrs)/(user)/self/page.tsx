import { Keyring } from "@shared/client";
import { MainHeader } from "@syrs/ui";
import { User } from "@syrs/client";
import { getSelf } from "@core/client";

export default function Page() {
  const self = getSelf({ unauthorize: "/signin" });
  return (
    <>
      <MainHeader items={[{ type: "self", name: "profile" }]} />
      <div className="flex items-center gap-2">
        <div className="text-2xl">My Profile</div>
        <User.Util.EditSelf />
      </div>
      <div>
        <User.Zone.Self />
      </div>
      <div>
        <div className="font-bold">Password</div>
        <div>
          *******
          <span>
            <Keyring.Util.ChangePasswordWithPhone />
          </span>
        </div>
      </div>
    </>
  );
}
