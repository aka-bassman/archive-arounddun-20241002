"use client";
import { Data } from "@shared/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { cnst } from "@syrs/client";
import { getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "test",
  queryMap = getQueryMap(cnst.TestSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      className={className}
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalTest"]}
      hidePresents={hidePresents}
    />
  );
};

export const Insight = ({
  className,
  insight,
  sliceName = "test",
}: ModelInsightProps<cnst.TestInsight>) => {
  return (
    <Data.Insight
      className={className}
      insight={insight}
      sliceName={sliceName}
      columns={["count"]}
    />
  );
};
