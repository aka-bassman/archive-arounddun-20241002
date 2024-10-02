"use client";
import { Modal } from "../Modal";
import {
  type Type,
  getClassMeta,
  getFieldMetas,
  getGqlTypeStr,
  getNonArrayModel,
  isGqlClass,
  isGqlScalar,
  scalarNameMap,
} from "@core/base";
import { lowerlize } from "@core/common";
import { useMemo, useState } from "react";
import { usePage } from "@util/client";

export default function Object() {
  return <div></div>;
}

interface ObjectTypeProps {
  objRef: Type;
  arrDepth: number;
  nullable?: boolean;
}
const ObjectType = ({ objRef, arrDepth, nullable }: ObjectTypeProps) => {
  const isModelType = !isGqlScalar(objRef);
  const refName = getGqlTypeStr(objRef);
  const [openDetail, setOpenDetail] = useState(false);
  return (
    <>
      <div
        className={isModelType ? "btn btn-sm btn-primary" : ""}
        onClick={() => {
          if (isModelType) setOpenDetail(true);
        }}
      >
        {"[".repeat(arrDepth)}
        {refName}
        {"]".repeat(arrDepth)}
        {nullable ? "" : "!"}
      </div>
      {isModelType ? (
        <Modal
          title={`Model Type - ${refName}`}
          open={openDetail}
          onCancel={() => {
            setOpenDetail(false);
          }}
        >
          {openDetail ? <ObjectDetail objRef={objRef} /> : null}
        </Modal>
      ) : null}
    </>
  );
};
Object.Type = ObjectType;

interface ObjectDetailProps {
  objRef: Type;
}
const ObjectDetail = ({ objRef }: ObjectDetailProps) => {
  const classMeta = getClassMeta(objRef);
  const refName = lowerlize(getGqlTypeStr(objRef));
  const modelRefName = useMemo(
    () =>
      classMeta.type === "light"
        ? lowerlize(refName.replace("light", ""))
        : refName.startsWith("summary")
          ? refName
          : refName.replace("Summary", "").replace("Insight", "").replace("Input", ""),
    []
  );
  const fieldMetas = getFieldMetas(objRef);
  const { l } = usePage();
  return (
    <div>
      <table className="table">
        <thead>
          <tr className="text-bold">
            <th className="text-base ">Key</th>
            <th className="text-center text-base">Type</th>
            <th className="text-center text-base">Enum</th>
            <th className="text-center text-base">Field Name</th>
            <th className="text-center text-base">Description</th>
          </tr>
        </thead>
        {fieldMetas.map(({ key, arrDepth, name, nullable, modelRef, isClass, enum: enumOpt, isMap, of }, idx) => (
          <tbody className="font-normal" key={idx}>
            <tr>
              <td className="">{key}</td>
              <td className="text-center">
                {isClass ? (
                  <ObjectType objRef={modelRef} arrDepth={arrDepth} />
                ) : (
                  `${"[".repeat(arrDepth)}${name}${"]".repeat(arrDepth)}${nullable ? "" : "!"}`
                )}

                {isMap ? (
                  <>
                    {" => "}
                    {(() => {
                      const [valueRef, valueArrDepth] = getNonArrayModel(of);
                      if (isGqlClass(of as Type))
                        return <ObjectType objRef={valueRef as Type} arrDepth={valueArrDepth} />;
                      else
                        return `${"[".repeat(valueArrDepth)}${scalarNameMap.get(of as Type)}${"]".repeat(valueArrDepth)}`;
                    })()}
                  </>
                ) : null}
              </td>
              <td className="flex flex-col gap-2 text-center">
                {enumOpt
                  ? enumOpt.map((opt, idx: number) => (
                      <div
                        key={idx}
                        className="tooltip tooltip-primary"
                        data-tip={l.enum(modelRefName as any, key, opt)}
                      >
                        <button className="btn btn-xs">{opt}</button>
                      </div>
                    ))
                  : "-"}
              </td>
              <td className="text-center">{l.field(modelRefName as any, key)}</td>
              <td className="text-center">{l.desc(modelRefName as any, key)}</td>
            </tr>
          </tbody>
        ))}
      </table>
    </div>
  );
};
Object.Detail = ObjectDetail;

interface ObjectSchemaProps {
  objRef: Type;
}
const ObjectSchema = ({ objRef }: ObjectSchemaProps) => {
  const { l } = usePage();
  const classMeta = getClassMeta(objRef);
  const refName = lowerlize(classMeta.refName);
  return (
    <div className="flex break-after-page flex-col gap-4">
      <div className="mt-24" />
      <div className="text-3xl font-bold">{refName}</div>
      <div className="mb-5"> - {l.field(refName as any, "modelDesc")}</div>
      <div className="text-2xl font-bold">Schema</div>
      <ObjectDetail objRef={objRef} />
    </div>
  );
};
Object.Schema = ObjectSchema;
