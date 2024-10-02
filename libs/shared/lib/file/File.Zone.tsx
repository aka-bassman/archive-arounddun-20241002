"use client";
import { Data } from "@shared/ui";
import { File, cnst } from "@shared/client";
import { ModelsProps } from "@core/client";

export const Admin = ({ sliceName = "file", init, query }: ModelsProps<cnst.File>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={File.Unit.Card}
      renderDashboard={File.Util.Stat}
      renderInsight={File.Util.Insight}
      renderTemplate={File.Template.General}
      renderTitle={(file: cnst.LightFile) => file.filename}
      type="list"
      columns={["filename", "createdAt", "status"]}
      actions={(file: cnst.LightFile, idx) => ["remove", "view"]}
    />
  );
};
