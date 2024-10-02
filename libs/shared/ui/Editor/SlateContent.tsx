"use client";
import { Plate, PlateContent } from "@udecode/plate-common";
import { isSlateJsonString } from "@core/common";

import { slatePlugins } from "./plateUi/slatePlugins";

export default function SlateContent({ content, className = "" }: { content: string; className?: string }) {
  return (
    <div className={className}>
      {isSlateJsonString(content) && (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unnecessary-type-assertion
        <Plate initialValue={JSON.parse(content) as any} plugins={slatePlugins}>
          <PlateContent readOnly />
        </Plate>
      )}
    </div>
  );
}
