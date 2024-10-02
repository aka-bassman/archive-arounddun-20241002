"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { ModelsProps } from "@core/client";
import { Test, cnst } from "@syrs/client";

export const Admin = ({ sliceName = "test", init, query }: ModelsProps<cnst.Test>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Test.Unit.Card}
      renderDashboard={Test.Util.Stat}
      renderInsight={Test.Util.Insight}
      renderTemplate={Test.Template.General}
      renderTitle={(test: DefaultOf<cnst.Test>) => `Test - ${test.id ? test.id : "New"}`}
      renderView={(test: cnst.Test) => <Test.View.General test={test} />}
      columns={["id", "status", "createdAt", "updatedAt"]}
      actions={(test: cnst.LightTest, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"test", cnst.LightTest>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(test: cnst.LightTest) => <Test.Unit.Card key={test.id} href={`/test/${test.id}`} test={test} />}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"test", cnst.Test>;
}
export const View = ({ view }: ViewProps) => {
  return <Load.View view={view} renderView={(test) => <Test.View.General test={test} />} />;
};
