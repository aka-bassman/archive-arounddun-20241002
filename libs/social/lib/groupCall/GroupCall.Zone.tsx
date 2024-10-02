"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { GroupCall, cnst } from "@social/client";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "groupCall", init, query }: ModelsProps<cnst.GroupCall>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={GroupCall.Unit.Card}
      renderDashboard={GroupCall.Util.Stat}
      renderInsight={GroupCall.Util.Insight}
      renderTemplate={GroupCall.Template.General}
      renderTitle={(groupCall: DefaultOf<cnst.GroupCall>) => groupCall.id}
      renderView={(groupCall: cnst.GroupCall) => <GroupCall.View.General groupCall={groupCall} />}
      type="list"
      columns={["type", "status", "createdAt"]}
      actions={(groupCall: cnst.LightGroupCall, idx) => [
        "remove",
        "edit",
        // { type: "approve", render: () => <GroupCall.Util.Approve groupCall={groupCall} idx={idx} sliceName={sliceName} /> },
      ]}
    />
  );
};

interface CardProps {
  init: ClientInit<"groupCall", cnst.LightGroupCall>;
}
export const Card = ({ init }: CardProps) => {
  return (
    <Load.Units
      init={init}
      renderItem={(groupCall) => <GroupCall.Unit.Card key={groupCall.id} groupCall={groupCall} />}
    />
  );
};

interface ConnectionProps {
  selfId: string;
  view: ClientView<"groupCall", cnst.GroupCall>;
}
export const Connection = ({ selfId, view }: ConnectionProps) => {
  return (
    <Load.View
      view={view}
      renderView={(groupCall) => <GroupCall.View.Connection selfId={selfId} groupCall={groupCall} />}
    />
  );
};
