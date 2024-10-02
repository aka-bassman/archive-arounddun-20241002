import { clsx } from "@core/client";
import { cnst } from "../cnst";
import { usePage } from "@social/client";

interface ChatRoomViewProps {
  className?: string;
  chatRoom: cnst.ChatRoom;
}

export const General = ({ className, chatRoom }: ChatRoomViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx("w-full", className)}>
      <div className="flex justify-between p-2 text-2xl">
        <h3>Chat</h3>
      </div>
    </div>
  );
};
