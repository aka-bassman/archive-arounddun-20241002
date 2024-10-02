"use client";
import { DataAction, DataColumn, clsx } from "@core/client";
import { FetchInitForm, type FilterType, SortType } from "@core/base";
import { Loading } from "@util/ui";
import { Model } from "../Model";
import { capitalize } from "@core/common";
import { st } from "@shared/client";
import DataItem from "./Item";
import DataPagination from "./Pagination";
import React, { ReactNode, useEffect } from "react";

type DataItemProps<T extends string, M extends { id: string }, L extends { id: string }> = {
  [key in T]: L;
} & { sliceName: string };

interface CardListProps<
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Filter extends FilterType,
> {
  className?: string;
  cardListClassName?: string;
  init?: FetchInitForm<Input, Full, Filter>;
  sliceName: string;
  columns: DataColumn<any>[];
  actions?: DataAction<Light>[] | ((item: Light, idx: number) => DataAction<Light>[]);
  renderItem: (args: DataItemProps<T, Full, Light>) => ReactNode;
  renderLoading?: () => ReactNode;
  renderTemplate?: (props: any) => JSX.Element | null;
  renderView?: (model: Full) => JSX.Element | null;
  renderTitle?: (model: Full) => string | JSX.Element;
}
export default function CardList<
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
>({
  className,
  cardListClassName = "",
  init,
  sliceName,
  actions,
  columns,
  renderItem,
  renderLoading,
  renderTemplate,
  renderView,
  renderTitle,
}: CardListProps<T, Input, Full, Light, Sort>) {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, modelClassName] = [refName, capitalize(refName)];
  const names = {
    model: modelName,
    modelId: `${modelName}Id`,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    limitOfModel: `limitOf${modelClassName}`,
    initModel: `init${modelClassName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    limitOfModel: sliceName.replace(names.model, names.limitOfModel),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();
  const limitOfModel = storeUse[namesOfSlice.limitOfModel]<number>();
  const RenderItem: any = renderItem;
  useEffect(() => {
    if (init) void storeDo[namesOfSlice.initModel](init);
  }, []);
  const RenderTemplate = ({ id }: { id: string }) => {
    const Edit = renderTemplate;
    return Edit ? <Edit {...{ [names.modelId]: id }} /> : null;
  };
  return (
    <div key={sliceName} className={className}>
      {modelMapLoading ? (
        <div className={clsx("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5", cardListClassName)}>
          {new Array(limitOfModel || 20)
            .fill(0)
            .map((_, idx) => (renderLoading ? renderLoading() : <Loading key={idx} active />))}
        </div>
      ) : (
        <div className={clsx("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5", cardListClassName)}>
          {[...modelMap.values()].map((model, idx) => {
            return (
              <DataItem
                key={model.id}
                model={model}
                sliceName={sliceName}
                actions={typeof actions === "function" ? actions(model, idx) : actions}
                columns={columns}
              >
                <RenderItem
                  {...({
                    [sliceName]: model,
                    sliceName,
                    actions: typeof actions === "function" ? actions(model, idx) : actions,
                    columns,
                    idx,
                  } as DataItemProps<T, Full, Light>)}
                />
              </DataItem>
            );
          })}
        </div>
      )}
      <DataPagination sliceName={sliceName} />
      {!modelMapLoading
        ? [...modelMap.values()].map((model) => (
            <>
              <Model.EditModal key={model.id} id={model.id} sliceName={sliceName} renderTitle={renderTitle}>
                <RenderTemplate id={model.id} />
              </Model.EditModal>
              {renderView ? (
                <Model.ViewModal
                  key={`${model.id}-view`}
                  id={model.id}
                  sliceName={sliceName}
                  renderTitle={renderTitle}
                  renderView={renderView}
                />
              ) : null}
            </>
          ))
        : null}
    </div>
  );
}
