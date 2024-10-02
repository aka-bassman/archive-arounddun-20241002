"use client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { ModelsProps } from "@core/client";
import { Notification, cnst } from "@shared/client";

export const Admin = ({ sliceName = "notification", init, query }: ModelsProps<cnst.Notification>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Notification.Unit.Card}
      renderDashboard={Notification.Util.Stat}
      renderInsight={Notification.Util.Insight}
      renderTemplate={Notification.Template.General}
      renderTitle={(notification: DefaultOf<cnst.Notification>) => notification.id}
      renderView={(notification: cnst.Notification) => <Notification.View.General notification={notification} />}
      type="list"
      columns={["status", "createdAt"]}
      actions={(notification: cnst.LightNotification, idx) => ["remove", "edit"]}
    />
  );
};
