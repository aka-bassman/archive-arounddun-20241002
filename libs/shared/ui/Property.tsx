"use client";
import { ConstantFieldMeta, type Dayjs, type Type, getFieldMetas } from "@core/base";
import { Loading, RecentTime } from "@util/ui";
import { StoreOf } from "@core/client";
import { capitalize } from "@core/common";
import { useCallback, useMemo } from "react";

interface PropertyProps {
  label?: string;
  prop: string;
  modelPath?: string;
  renderTemplate?: (form: any) => JSX.Element;
  renderView?: (model: any) => JSX.Element;
  slice: StoreOf<any, any>;
}

export const Property = ({ label, prop, slice, modelPath, renderTemplate, renderView }: PropertyProps) => {
  const sliceDo = slice.do as { [key: string]: (...args) => void };
  const sliceUse = slice.use as { [key: string]: <T>() => T };
  const model = sliceUse[modelPath ?? slice.sliceName]<{ id: string; [key: string]: any } | null>();
  const modelLoading = sliceUse[`${slice.refName}Loading`]<string | boolean>();
  const modelClass = sliceUse[`${slice.refName}Class`]<Type>();
  const modelForm = sliceUse[`${slice.refName}Form`]<{ id: string; [key: string]: any }>();
  const modelModal = sliceUse[`${slice.refName}Modal`]<string | null>();
  const constantFieldMeta = useMemo(
    () => getFieldMetas(modelClass).find((ConstantfieldMeta) => ConstantfieldMeta.key === prop),
    []
  );
  const setState = useCallback((val) => {
    sliceDo[`set${capitalize(prop)}On${capitalize(slice.refName)}`](val);
  }, []);
  const update = useCallback(() => {
    sliceDo[`update${capitalize(slice.sliceName)}`](modelPath);
  }, []);
  const reset = useCallback(() => {
    sliceDo[`reset${capitalize(slice.sliceName)}`]();
  }, []);
  const edit = useCallback(() => {
    sliceDo[`edit${capitalize(slice.sliceName)}`](model);
  }, []);

  if (!constantFieldMeta) throw new Error("ConstantFieldMeta not found");
  return (
    <div>
      <p className="text-lg">{label ?? prop}</p>
      {modelModal === "edit" && modelForm[prop] !== undefined ? (
        renderTemplate ? (
          renderTemplate(modelForm)
        ) : (
          <PropertyEdit
            metadata={constantFieldMeta}
            model={model}
            value={modelForm[prop] as object}
            slice={slice}
            modelPath={modelPath}
            setState={setState}
            update={update}
            reset={reset}
          />
        )
      ) : modelLoading ? (
        <Loading.Input />
      ) : renderView ? (
        renderView(model)
      ) : (
        <PropertyView
          metadata={constantFieldMeta}
          model={model}
          value={model?.[prop] as object}
          slice={slice}
          modelPath={modelPath}
          edit={edit}
        />
      )}
    </div>
  );
};
export interface PropertyEditProps {
  metadata: ConstantFieldMeta;
  model: any;
  value: any;
  slice: StoreOf<any, any>;
  modelPath?: string;
  setState: (val: any) => void;
  update: () => void;
  reset: () => void;
}
export const PropertyEdit = ({
  metadata,
  model,
  value,
  slice,
  modelPath,
  setState,
  update,
  reset,
}: PropertyEditProps) => {
  if (value === null || value === undefined) return null;
  if (metadata.isArray && Array.isArray(value))
    return (
      <>
        {value.map((val, idx) => (
          <PropertyEdit
            key={idx}
            metadata={metadata}
            model={model as object}
            value={val as object}
            slice={slice}
            modelPath={modelPath}
            setState={setState}
            update={update}
            reset={reset}
          />
        ))}
      </>
    );
  if (metadata.name === "Date") return <RecentTime date={value as Dayjs} />;
  if (["String", "ID"].includes(metadata.name))
    return (
      <div
      // editable={{ onChange: setState, onEnd: update, onCancel: reset }} onBlur={() => reset()}
      >
        {value}
      </div>
    );
  return null;
};

export interface PropertyViewProps {
  metadata: ConstantFieldMeta;
  model: any;
  value: object | string | boolean | Dayjs | undefined | null;
  slice: StoreOf<any, any>;
  modelPath?: string;
  edit: () => void;
}
export const PropertyView = (args: PropertyViewProps) => {
  const { metadata, value, slice, modelPath, edit } = args;
  if (value === null || value === undefined) return null;
  if (metadata.isArray && Array.isArray(value))
    return (
      <>
        {value.map((val, idx) => (
          <PropertyView key={idx} {...args} value={val as object} />
        ))}
      </>
    );
  if (metadata.name === "Date") return <RecentTime date={value as Dayjs} />;
  if (metadata.name === "ID") return <p>{value as string}</p>;
  if (metadata.name === "String")
    return (
      <p
      //  editable={!metadata && { onStart: edit }}
      >
        {value as string}
      </p>
    );
  return null;
};
