"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst, fetch, st, usePage, ImageHosting } from "@syrs/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "imageHosting",
  queryMap = getQueryMap(cnst.ImageHostingSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalImageHosting"]}
      hidePresents={hidePresents}
    />
  );
};

export const Insight = ({
  className,
  insight,
  sliceName = "imageHosting",
}: ModelInsightProps<cnst.ImageHostingInsight>) => {
  return (
    <Data.Insight
      className={className}
      insight={insight}
      sliceName={sliceName}
      columns={["count"]}
    />
  );
};
