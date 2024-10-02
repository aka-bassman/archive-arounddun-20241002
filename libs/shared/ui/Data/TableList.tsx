"use client";
import { Action, convToAntdColumn } from "./Item";
import { DataAction, DataColumn } from "@core/client";
import { FetchInitForm, SortType } from "@core/base";
import { Model } from "../Model";
import { Table } from "@util/ui";
import { capitalize } from "@core/common";
import { st, usePage } from "@shared/client";
import DataPagination from "./Pagination";
import React, { useEffect, useMemo } from "react";

interface TableListProps<
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
> {
  className?: string;
  queryArgs?: any[];
  init?: FetchInitForm<Input, Full, Sort>;
  sliceName: string;
  columns: DataColumn<any>[];
  renderTemplate?: (props: any) => JSX.Element | null;
  renderTitle?: (model: Full) => string | JSX.Element;
  renderView?: (model: Full) => JSX.Element | null;
  actions?: DataAction<Light>[] | ((item: Light, idx: number) => DataAction<Light>[]);
  onItemClick?: (item: Light, idx: number) => void;
}
export default function TableList<
  T extends string,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
>({
  className,
  init,
  queryArgs = [],
  sliceName,
  columns,
  actions,
  renderTemplate,
  renderTitle,
  renderView,
  onItemClick,
}: TableListProps<T, Input, Full, Light, Sort>) {
  const { l } = usePage();
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
    initModel: `init${modelClassName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    initModel: sliceName.replace(names.model, names.initModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();
  const RenderTemplate = ({ id }: { id: string }) => {
    const Edit = renderTemplate;
    return Edit ? <Edit {...{ [names.modelId]: id }} /> : null;
  };
  useEffect(() => {
    if (queryArgs.length) void storeDo[namesOfSlice.initModel](...(queryArgs as object[]), init);
  }, []);
  const cols = useMemo(() => {
    const firstCol = {
      ...convToAntdColumn(columns[0]),
      title:
        typeof columns[0] !== "string" && columns[0].title
          ? columns[0].title
          : l.field(
              sliceName as any,
              typeof columns[0] === "string" ? columns[0] : (columns[0] as { key: string }).key
            ),
    };
    return [
      {
        ...firstCol,
        render: (value, model: Light, idx: number) => (
          <div key={`${model.id}-${idx}`} className="flex items-center">
            <div className="mr-2">{firstCol.render ? firstCol.render(value, model) : value}</div>
            {actions &&
              (typeof actions === "function" ? actions(model, idx) : actions)
                .filter((action) => typeof action === "string")
                .map((action, idx) => (
                  <Action
                    key={`${model.id}-${action as unknown as string}`}
                    model={model}
                    action={action}
                    sliceName={sliceName}
                  />
                ))}
          </div>
        ),
      },
      ...columns.slice(1).map((col) => ({
        ...convToAntdColumn(col),
        title:
          typeof col !== "string" && col.title
            ? col.title
            : l.field(sliceName as any, typeof col === "string" ? col : (col.key as string)),
      })),
      ...(actions
        ? [
            {
              key: "actions",
              dataIndex: "id",
              title: l("shared.actions"),
              render: (_, model: Light, idx: number) => (
                <div className="flex gap-1">
                  {(typeof actions === "function" ? actions(model, idx) : actions)
                    .filter((action) => typeof action !== "string")
                    .map((action, idx) => (
                      <Action key={`${model.id}-${idx}`} model={model} action={action} sliceName={sliceName} />
                    ))}
                </div>
              ),
            },
          ]
        : []),
    ] as { key: string; dataIndex: string; title: string; render: (...args) => JSX.Element }[];
  }, []);
  return (
    <div className={className}>
      <Table
        dataSource={(modelMapLoading ? [] : [...modelMap.values()]) as any[]}
        columns={cols}
        loading={!!modelMapLoading}
        size="small"
        rowKey={(model: Light) => model.id}
        pagination={false}
        onRow={(model: Light, idx: number) => ({
          onClick: () => onItemClick?.(model, idx),
        })}
      />
      <DataPagination sliceName={sliceName} />
      {!modelMapLoading
        ? [...modelMap.values()].map((model) => (
            <>
              <Model.EditModal key={model.id} id={model.id} sliceName={sliceName} renderTitle={renderTitle}>
                <RenderTemplate id={model.id} />
              </Model.EditModal>
              {renderView ? (
                <Model.ViewModal
                  key={model.id}
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
