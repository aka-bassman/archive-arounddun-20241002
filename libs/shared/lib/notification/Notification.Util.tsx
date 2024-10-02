"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst } from "@shared/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "notification",
  queryMap = getQueryMap(cnst.NotificationSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalNotification"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({
  className,
  insight,
  sliceName = "notification",
}: ModelInsightProps<cnst.NotificationInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};
