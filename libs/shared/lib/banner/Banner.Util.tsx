"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst } from "@shared/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "banner",
  queryMap = getQueryMap(cnst.BannerSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalBanner"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "banner" }: ModelInsightProps<cnst.BannerInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};
