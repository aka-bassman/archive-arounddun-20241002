import { AiOutlineClose, AiOutlineUser } from "react-icons/ai";
import { clsx } from "@core/client";

export const Profile = () => {
  return <></>;
};
const Empty = ({ className }: { className?: string }) => {
  return (
    <div className={clsx("flex size-10 items-center justify-center rounded-full bg-gray-300 text-2xl", className)}>
      <AiOutlineUser style={{ color: "white" }} />
    </div>
  );
};
Profile.Empty = Empty;

const Removed = ({ className }: { className?: string }) => {
  return (
    <div
      className={clsx(
        "flex size-6 items-center justify-center rounded-full bg-white text-2xl text-gray-300",
        className
      )}
    >
      <AiOutlineClose />
    </div>
  );
};
Profile.Removed = Removed;
