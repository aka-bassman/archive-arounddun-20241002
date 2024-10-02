import { Image, Link, RecentTime } from "@util/ui";
import { ModelProps, clsx } from "@core/client";
import { cnst } from "../cnst";

export const Abstract = ({ className, chatRoom, href }: ModelProps<"chatRoom", cnst.LightChatRoom>) => {
  return (
    <Link href={href}>
      <button className={clsx("btn btn-secondary w-full", className)}>
        {chatRoom.chats.at(-1)?.text ?? "Chat"} - <RecentTime date={chatRoom.updatedAt} />
      </button>
    </Link>
  );
};

interface CardProps extends ModelProps<"chatRoom", cnst.LightChatRoom> {
  selfId?: string;
}

export const Card = ({ chatRoom, href, className, selfId }: CardProps) => {
  const user = selfId ? chatRoom.getOpponentUser(selfId) : null;
  return (
    <Link href={href}>
      <div className={clsx("flex items-center justify-between py-2", className)}>
        <div className="flex w-full items-center  gap-2 truncate">
          <div className="from-primary to-secondary flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-bl">
            <Image src={user?.image?.url} className="size-12 rounded-full" />
          </div>
          <div className="flex flex-col">
            <div className="font-coredream-semibold flex items-center gap-1 font-bold">
              {user?.nickname}
              {/* {chatRoom.contribution.totalCount === 0 ? (
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
              ) : null} */}
            </div>
            <div className="truncate text-xs">
              {chatRoom.status === "closed" ? "대화가 종료되었습니다." : chatRoom.chats.at(-1)?.text}
            </div>
          </div>
        </div>
        <div className="shrink-0 whitespace-nowrap">
          <RecentTime date={chatRoom.updatedAt} className="text-xs" />
        </div>
      </div>
    </Link>
  );
};
