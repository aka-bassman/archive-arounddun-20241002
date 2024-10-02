"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { ModelsProps } from "@core/client";
import { Prompt, cnst } from "@syrs/client";

export const Admin = ({ sliceName = "prompt", init, query }: ModelsProps<cnst.Prompt>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Prompt.Unit.Card}
      renderDashboard={Prompt.Util.Stat}
      renderInsight={Prompt.Util.Insight}
      renderTemplate={Prompt.Template.General}
      renderTitle={(prompt: DefaultOf<cnst.Prompt>) => `Prompt - ${prompt.id ? prompt.id : "New"}`}
      renderView={(prompt: cnst.Prompt) => <Prompt.View.General prompt={prompt} />}
      columns={["id", "status", "createdAt", "updatedAt"]}
      actions={(prompt: cnst.LightPrompt, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"prompt", cnst.LightPrompt>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(prompt: cnst.LightPrompt) => (
        <Prompt.Unit.Card key={prompt.id} href={`/prompt/${prompt.id}`} prompt={prompt} />
      )}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"prompt", cnst.Prompt>;
}
export const View = ({ view }: ViewProps) => {
  return <Load.View view={view} renderView={(prompt) => <Prompt.View.General prompt={prompt} />} />;
};
