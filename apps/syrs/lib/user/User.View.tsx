import { AiOutlineUser } from "react-icons/ai";
import { Avatar } from "@util/ui";
import { Keyring } from "@shared/client";
import { Only } from "@shared/ui";
import { clsx } from "@core/client";
import { cnst } from "../cnst";
import { usePage } from "@syrs/client";

interface UserViewProps {
  className?: string;
  user: cnst.User;
}

export const General = ({ className, user }: UserViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(`flex flex-col gap-4`, className)}>
      <div>
        <div className="font-bold">Profile</div>
        <div className="text-base">
          <Avatar
            className="flex items-center justify-center w-24 h-24"
            icon={<AiOutlineUser className="text-4xl" />}
            src={user.image?.url}
          />
        </div>
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <div className="font-bold">Nickname</div>
          <Only.Admin>
            <Keyring.Util.ViewKeyring id={user.keyring} />
          </Only.Admin>
        </div>
        <p className="text-base">{user.nickname}</p>
      </div>
    </div>
  );
};
