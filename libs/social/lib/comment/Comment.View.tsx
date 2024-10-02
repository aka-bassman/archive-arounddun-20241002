import { Avatar, RecentTime } from "@util/ui";
import { Profile } from "@social/ui";
import { cnst } from "../cnst";
import { usePage } from "@social/client";

interface CommentViewProps {
  className?: string;
  comment: cnst.Comment;
}

export const General = ({ className, comment }: CommentViewProps) => {
  const { l } = usePage();
  return (
    <div
      className={`flex flex-row justify-between gap-1 border-t-[0.5px] border-gray-300 ${comment.parent ? "ml-8" : ""}`}
    >
      <div className="flex w-full items-start py-2">
        <div className="mr-2">
          {comment.user.image ? (
            <Avatar src={comment.user.image.url} />
          ) : (
            <Profile.Empty className={comment.parent ? "size-8 text-xl" : ""} />
          )}
        </div>
        <div className="flex w-full flex-col">
          <div className="mb-1 text-sm font-medium">
            <div className="flex text-xs">
              {comment.user.nickname}
              <div className="ml-1 text-gray-400">
                <RecentTime date={comment.createdAt} breakUnit="day" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
