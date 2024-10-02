"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst } from "@social/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "serviceDesk",
  queryMap = getQueryMap(cnst.ServiceDeskSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalServiceDesk"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({
  className,
  insight,
  sliceName = "serviceDesk",
}: ModelInsightProps<cnst.ServiceDeskInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};
