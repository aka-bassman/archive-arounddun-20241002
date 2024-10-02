import { AiOutlineEye, AiOutlineLeft } from "react-icons/ai";
import { Editor } from "@shared/ui";
import { HtmlContent, Layout, Link, RecentTime } from "@util/ui";
import { Story } from "@social/client";
import { cnst } from "../cnst";
import { isSlateJsonString } from "@core/common";

interface StoryViewProps {
  className?: string;
  story: cnst.Story;
  back?: boolean;
  self?: { id: string } | null;
  showLikeDislike?: boolean;
}

export const General = ({ className, story, back, self, showLikeDislike = true }: StoryViewProps) => {
  return (
    <Layout.View className={className}>
      <div className="border-base-content/20 border-b">
        <div className="mb-0  flex items-center  justify-between text-2xl font-bold md:text-4xl">
          <h3 className="mb-3 flex items-center gap-2">
            {back && (
              <Link.Back>
                <AiOutlineLeft className="mr-2" />
              </Link.Back>
            )}
            {story.title}
          </h3>
          <Story.Util.ToolMenu id={story.id} root={story.root} rootType={story.rootType} isMe={story.isMe(self)} />
        </div>
        <div className="border-base-content/10  mt-0 flex justify-between px-2 pb-2  text-xs md:text-base">
          <div>{story.user?.nickname}</div>
          <div className="flex">
            <div className="mr-6 flex items-center justify-center">
              <AiOutlineEye className="mr-1" />
              {story.totalStat.views}
            </div>
            <RecentTime date={story.createdAt} breakUnit="second" format="full" />
          </div>
        </div>
      </div>
      <div className="min-h-[400px] p-8">
        {isSlateJsonString(story.content) ? (
          <Editor.SlateContent content={story.content} />
        ) : (
          <HtmlContent content={story.content} />
        )}
      </div>
      {showLikeDislike ? (
        <div className="mt-3 flex justify-center">
          <Story.Util.LikeDislike id={story.id} like={story.like} totalLike={story.totalStat.likes} />
        </div>
      ) : null}
    </Layout.View>
  );
};
