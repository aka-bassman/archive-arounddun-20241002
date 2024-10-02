import { RecentTime } from "@util/ui";
import { clsx } from "@core/client";
import { cnst } from "../cnst";
import { usePage } from "@social/client";

interface EmojiViewProps {
  className?: string;
  emoji: cnst.Emoji;
}

export const General = ({ className, emoji }: EmojiViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(className, ``)}>
      <div className="mb-0 mt-4 flex justify-between border-b border-gray-200 p-2 text-2xl">
        <h3>
          {l("emoji.id")}-{emoji.id}
        </h3>
      </div>
      <div className="mt-0 flex justify-between bg-gray-50 p-4 text-xs md:text-base">
        <div>{emoji.status}</div>
        <RecentTime date={emoji.createdAt} breakUnit="second" />
      </div>
    </div>
  );
};
