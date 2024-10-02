"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst } from "@syrs/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "result",
  queryMap = getQueryMap(cnst.ResultSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalResult"]}
      hidePresents={hidePresents}
    />
  );
};

export const Insight = ({
  className,
  insight,
  sliceName = "result",
}: ModelInsightProps<cnst.ResultInsight>) => {
  return (
    <Data.Insight
      className={className}
      insight={insight}
      sliceName={sliceName}
      columns={["count"]}
    />
  );
};
