"use client";
import { ClientInit, ClientView, DefaultOf } from "@core/base";
import { Data, Load } from "@shared/ui";
import { ImageHosting, cnst } from "@syrs/client";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "imageHosting", init, query }: ModelsProps<cnst.ImageHosting>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={ImageHosting.Unit.Card}
      renderDashboard={ImageHosting.Util.Stat}
      renderInsight={ImageHosting.Util.Insight}
      renderTemplate={ImageHosting.Template.General}
      renderTitle={(imageHosting: DefaultOf<cnst.ImageHosting>) =>
        `ImageHosting - ${imageHosting.id ? imageHosting.id : "New"}`
      }
      renderView={(imageHosting: cnst.ImageHosting) => <ImageHosting.View.General imageHosting={imageHosting} />}
      columns={["id", "status", "createdAt", "updatedAt"]}
      actions={(imageHosting: cnst.LightImageHosting, idx) => ["remove", "edit", "view"]}
    />
  );
};

interface CardProps {
  className?: string;
  init: ClientInit<"imageHosting", cnst.LightImageHosting>;
}
export const Card = ({ className, init }: CardProps) => {
  return (
    <Load.Units
      className={className}
      init={init}
      renderItem={(imageHosting: cnst.LightImageHosting) => (
        <ImageHosting.Unit.Card
          key={imageHosting.id}
          href={`/imageHosting/${imageHosting.id}`}
          imageHosting={imageHosting}
        />
      )}
    />
  );
};

interface ViewProps {
  className?: string;
  view: ClientView<"imageHosting", cnst.ImageHosting>;
}
export const View = ({ view }: ViewProps) => {
  return (
    <Load.View view={view} renderView={(imageHosting) => <ImageHosting.View.General imageHosting={imageHosting} />} />
  );
};
