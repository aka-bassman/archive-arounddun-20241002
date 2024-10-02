"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { Link } from "@util/ui";
import { ModelsProps } from "@core/client";
import { Org, cnst } from "@social/client";

export const Admin = ({ sliceName = "org", init, query }: ModelsProps<cnst.Org>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Org.Unit.Card}
      renderDashboard={Org.Util.Stat}
      renderInsight={Org.Util.Insight}
      renderTemplate={Org.Template.General}
      renderTitle={(org: DefaultOf<cnst.Org>) => org.name}
      renderView={(org: cnst.Org) => <Org.View.General org={org} />}
      columns={["id", "status", "createdAt"]}
      actions={(org: cnst.LightOrg, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"org", cnst.LightOrg>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderEmpty={() => (
        <Link href="/org/new" className="animate-fadeIn shadow duration-300 hover:shadow-lg">
          <button className="btn  btn-outline h-full w-60 border-none text-4xl outline-dashed">
            <div className="flex  items-center justify-center whitespace-nowrap p-12">+ New</div>
          </button>
        </Link>
      )}
      renderItem={(org: cnst.Org) => <Org.Unit.Card key={org.id} href={`/org/${org.id}`} org={org} />}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"org", cnst.Org>;
}
export const View = ({ className, view }: ViewProps) => {
  return <Load.View noDiv className={className} view={view} renderView={(org) => <Org.View.General org={org} />} />;
};
