import { AiOutlineUser } from "react-icons/ai";
import { Image } from "./Image";
import { ReactNode } from "react";
import { clsx } from "@core/client";

interface AvatarProps {
  className?: string;
  icon?: ReactNode;
  src?: string;
}

export const Avatar = ({ className = "", icon, src = "" }: AvatarProps) => {
  return (
    <div className={clsx("avatar relative size-8 overflow-hidden rounded-full bg-black/20", className)}>
      {src ? (
        <Image src={src} className="object-cover" style={{ borderRadius: "50%" }} width={128} height={128} />
      ) : icon ? (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white ">
          <div className="">{icon}</div>
        </div>
      ) : (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white ">
          <AiOutlineUser />
        </div>
      )}
    </div>
  );
};
