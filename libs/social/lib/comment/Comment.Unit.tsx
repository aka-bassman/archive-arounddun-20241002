import { Avatar, RecentTime } from "@util/ui";
import { Comment, usePage } from "@social/client";
import { ModelProps } from "@core/client";
import { Profile } from "@social/ui";
import { ReactNode } from "react";
import { Self } from "@core/base";
import { cnst } from "../cnst";

export const Card = ({
  className,
  comment,
  sliceName = "comment",
  actions,
  columns,
  showProfile = true,
  self,
}: ModelProps<"comment", cnst.LightComment> & {
  self?: Self | cnst.User;
  showProfile: boolean;
}) => {
  const { l } = usePage();
  return (
    <div className={`flex flex-col  justify-between gap-1 pl-4  ${comment.parent ? "bg-base-200 pl-8" : ""} `}>
      <div className="flex  w-full py-2">
        {showProfile && (
          <div className="mr-2">
            {comment.user.image ? (
              <Avatar src={comment.user.image.url} />
            ) : (
              // <Profile.Empty className={comment.parent ? "w-8 h-8 text-xl" : ""} />
              <Profile.Empty />
            )}
          </div>
        )}
        <div className="flex w-full flex-col">
          <div className="mb-1 text-sm font-medium">
            <div className="flex text-sm">
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center justify-center">
                  <div className="font-bold">{comment.user.nickname}</div>
                  <div className="ml-3 text-gray-400">
                    <RecentTime date={comment.createdAt} breakUnit="second" />
                  </div>
                </div>
                <Comment.Util.ToolMenu id={comment.id} userId={comment.user.id} self={self} />
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-500">{comment.content}</div>
        </div>
      </div>
      <div className="flex w-full flex-col text-black ">
        <div className="flex text-gray-400">
          <Comment.Util.Like id={comment.id} like={comment.like} totalLike={comment.totalStat.likes} />
          <Comment.Util.NewCoco commentId={comment.id} meta={comment.meta} />
        </div>
      </div>
    </div>
  );
};

interface CommentItemRemovedProps {
  comment: cnst.LightComment;
  removedProfile?: ReactNode;
}

export const Removed = ({ comment, removedProfile = <Profile.Removed /> }: CommentItemRemovedProps) => {
  const { l } = usePage();
  return (
    <div className={`flex flex-row justify-between gap-1${comment.parent ? "ml-10" : "ml-3"}`}>
      <div className="flex w-full items-start py-2">
        <div className="mr-2">{removedProfile}</div>
        <div className="flex w-full flex-col">
          <div className="text-xs text-gray-500">
            <div className="text-gray-300">{l("comment.removedComment")}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
