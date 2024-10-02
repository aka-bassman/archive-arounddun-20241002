"use client";
import { AiOutlineSmile } from "react-icons/ai";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst, st } from "@social/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "emoji",
  queryMap = getQueryMap(cnst.EmojiSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalEmoji"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "emoji" }: ModelInsightProps<cnst.EmojiInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

export const Open = () => {
  return (
    <button
      onClick={() => { st.do.setEmojiModal("open"); }}
      className="flex size-[50px] cursor-pointer items-center justify-center rounded-[10px] border-[3px] border-black bg-white text-[26px] transition duration-500 hover:bg-gray-100"
    >
      <AiOutlineSmile />
    </button>
  );
};
