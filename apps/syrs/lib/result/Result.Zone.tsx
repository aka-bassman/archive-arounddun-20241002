"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { ModelsProps } from "@core/client";
import { Result, cnst } from "@syrs/client";

export const Admin = ({ sliceName = "result", init, query }: ModelsProps<cnst.Result>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Result.Unit.Card}
      renderDashboard={Result.Util.Stat}
      renderInsight={Result.Util.Insight}
      renderTemplate={Result.Template.General}
      renderTitle={(result: DefaultOf<cnst.Result>) => `Result - ${result.id ? result.id : "New"}`}
      renderView={(result: cnst.Result) => <Result.View.General result={result} />}
      columns={["id", "status", "createdAt", "updatedAt"]}
      actions={(result: cnst.LightResult, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"result", cnst.LightResult>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(result: cnst.LightResult) => (
        <Result.Unit.Card key={result.id} href={`/result/${result.id}`} result={result} />
      )}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"result", cnst.Result>;
}
export const View = ({ view }: ViewProps) => {
  return <Load.View view={view} renderView={(result) => <Result.View.General result={result} />} />;
};
