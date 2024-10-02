"use client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { ModelsProps } from "@core/client";
import { ServiceDesk, cnst } from "@social/client";

export const Admin = ({ sliceName = "serviceDesk", init, query }: ModelsProps<cnst.ServiceDesk>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={ServiceDesk.Unit.Card}
      renderDashboard={ServiceDesk.Util.Stat}
      renderInsight={ServiceDesk.Util.Insight}
      renderTemplate={ServiceDesk.Template.General}
      renderTitle={(serviceDesk: DefaultOf<cnst.ServiceDesk>) => `${serviceDesk.user?.nickname}`}
      renderView={(serviceDesk: cnst.ServiceDesk) => <ServiceDesk.View.General serviceDesk={serviceDesk} />}
      type="list"
      columns={["type", "status", "createdAt"]}
      actions={(serviceDesk: cnst.LightServiceDesk, idx) => ["remove", "edit"]}
    />
  );
};
