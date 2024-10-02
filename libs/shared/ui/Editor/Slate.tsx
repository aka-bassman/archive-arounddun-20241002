"use client";
import { DndProvider } from "react-dnd";
import { ELEMENT_PARAGRAPH } from "@udecode/plate-paragraph";
import { Editor, Toolbar } from "./plateUi";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Plate, TElement, Value, createPlateEditor } from "@udecode/plate-common";
import { cnst } from "@shared/client";
import { slatePlugins } from "./plateUi/slatePlugins";
import React, { useState } from "react";
import type { ProtoFile } from "@core/base";

// const Plate = lazy(() => import("@udecode/plate-common").then(module => ({ default: module.Plate })));

interface SlateProps {
  className?: string;
  addFilesGql: (fileList: FileList, id?: string) => Promise<(cnst.File | ProtoFile)[]>;
  addFile: (file: cnst.File | cnst.File[], options?: { idx?: number; limit?: number }) => void;
  onChange: (slate: string) => void;
  defaultValue?: string;
  height?: string;
  placeholder?: string;
  disabled?: boolean;
  debug?: boolean;
}

export default function Slate({
  className = "",
  addFilesGql,
  addFile,
  onChange,
  defaultValue = "",
  height = "500px",
  placeholder = "Untitled",
  debug,
}: SlateProps) {
  const initialValue = defaultValue
    ? (JSON.parse(defaultValue) as TElement[])
    : [
        {
          id: "1",
          type: ELEMENT_PARAGRAPH,
          children: [
            {
              text: "",
            },
          ],
        },
      ];
  const [debugValue, setDebugValue] = useState<Value>(initialValue);

  const editor = createPlateEditor({ plugins: slatePlugins });

  // const serializeSlateToHtml = (slateContent: TElement[]) => {
  //   return serializeHtml(editor, {
  //     nodes: slateContent,
  //     dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
  //   });
  // };

  return (
    <div className={className}>
      <DndProvider backend={HTML5Backend}>
        <Plate
          initialValue={initialValue}
          plugins={slatePlugins}
          onChange={(slateContent) => {
            onChange(JSON.stringify(slateContent));
            debug && setDebugValue(slateContent);
          }}
        >
          <div className="relative rounded-xl border border-black/20">
            <Toolbar addFile={addFile} addFilesGql={addFilesGql} />
            <Editor
              autoFocus
              focusRing={false}
              size="md"
              variant="ghost"
              style={{
                height,
              }}
              // placeholder={placeholder}
            />
            {/* <PlateContent placeholder="Type..." /> */}
          </div>

          {debug && (
            <>
              <div className="bg-base-300/50 border-base-300 text-base-content mt-4 w-full rounded-xl border p-2">
                <div className="mb-1 text-xs font-semibold">Debug :</div>
                {JSON.stringify(debugValue)}
                {/* <div className="font-semibold text-xs mb-1 mt-10">HTML :</div> */}
                {/* {serializeSlateToHtml(debugValue)} */}
              </div>
              {/* <HtmlContent content={serializeSlateToHtml(debugValue)} /> */}
            </>
          )}
        </Plate>
      </DndProvider>
    </div>
  );
}
