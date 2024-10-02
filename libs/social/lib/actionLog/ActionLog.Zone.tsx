"use client";
import { ActionLog, cnst } from "@social/client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "actionLog", init, query }: ModelsProps<cnst.ActionLog>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={ActionLog.Unit.Card}
      renderDashboard={ActionLog.Util.Stat}
      renderInsight={ActionLog.Util.Insight}
      renderTemplate={ActionLog.Template.General}
      renderTitle={(actionLog: DefaultOf<cnst.ActionLog>) => actionLog.type}
      renderView={(actionLog: cnst.ActionLog) => <ActionLog.View.General actionLog={actionLog} />}
      type="list"
      columns={["id"]}
      actions={["edit"]}
    />
  );
};
