"use client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { Loading } from "@util/ui";
import { ModelsProps } from "@core/client";
import { Summary, st } from "@syrs/client";
import { cnst } from "../cnst";

export const Admin = ({ sliceName = "summary", init, query }: ModelsProps<cnst.Summary>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Summary.Unit.Card}
      renderTemplate={Summary.Template.General}
      renderTitle={(summary: DefaultOf<cnst.Summary>) => `${summary.at}`}
      renderView={(summary: cnst.Summary) => <Summary.View.General summary={summary} />}
      type="list"
      columns={["type", "status", "createdAt"]}
      actions={(summary: cnst.LightSummary, idx) => ["remove", "edit"]}
    />
  );
};

export const Dashboard = () => {
  const summary = st.use.summary();
  if (!summary) return <Loading active />;
  return <Summary.View.General summary={summary} />;
};
