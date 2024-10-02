"use client";
import {
  AiOutlineEllipsis,
  AiOutlineFileExcel,
  AiOutlineFileProtect,
  AiOutlinePlus,
  AiOutlineRedo,
} from "react-icons/ai";
import { DataAction, DataColumn, DataTool, ModelInsightProps, ModelProps, clsx } from "@core/client";
import { Dropdown, Loading, Select } from "@util/ui";
import { FetchInitForm, SortType, getCnstMeta, getFilterSortMap } from "@core/base";
import { Model } from "../Model";
import { capitalize, deepObjectify } from "@core/common";
import { saveAs } from "file-saver";
import { st, usePage } from "@shared/client";
import DataCardList from "./CardList";
import DataTableList from "./TableList";
import QueryMaker from "./QueryMaker";
import React, { ReactNode } from "react";

interface FilterOption {
  key: string;
  query: { [key: string]: any };
}
type DataItemProps<T extends string, M extends { id: string }, L extends { id: string }> = {
  [key in T]: L;
} & { sliceName: string };

interface ListContainerProps<
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
> {
  className?: string;
  cardListClassName?: string;
  type?: "card" | "list";
  query?: { [key: string]: any };
  init?: FetchInitForm<Input, Full, Sort>;
  sliceName: string;
  create?: boolean;
  title?: string;
  sort?: SortType;
  columns?: DataColumn<any>[];
  tools?: DataTool[] | ((modelList: Light[]) => DataTool[]);
  actions?: DataAction<Light>[] | ((item: Light, idx: number) => DataAction<Light>[]);
  renderDashboard?: ({ summary, hidePresents }: any) => JSX.Element;
  renderItem?: (props: ModelProps<any, any>) => ReactNode;
  renderTemplate?: (props: any) => JSX.Element | null;
  renderTitle?: (model: Full) => string | JSX.Element;
  renderView?: (model: Full) => JSX.Element | null;
  renderQueryMaker?: () => JSX.Element;
  renderInsight?: (props: ModelInsightProps<any>) => JSX.Element;
  renderLoading?: () => ReactNode;
}

export default function ListContainer<
  T extends string,
  State,
  Input,
  Full extends { id: string },
  Light extends { id: string },
  Sort extends SortType,
>({
  className,
  cardListClassName,
  type = "card",
  query,
  init,
  create = true,
  sliceName,
  title,
  sort,
  columns = ["id", "createdAt", "updatedAt"],
  actions,
  tools = [],
  renderDashboard,
  renderItem,
  renderTemplate,
  renderTitle = (model) =>
    model.id ? (
      <h2 className="flex items-center justify-center py-3 text-lg sm:justify-start md:text-2xl">
        {sliceName} - {model.id}
      </h2>
    ) : (
      <h2 className="flex items-center justify-center py-3 text-lg sm:justify-start md:text-2xl">New {sliceName}</h2>
    ),
  renderView,
  renderQueryMaker = () => <></>,
  renderInsight,
  renderLoading,
}: ListContainerProps<T, State, Input, Full, Light, Sort>) {
  const { l } = usePage();
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, modelClassName] = [refName, capitalize(refName)];
  if (refName !== sliceName) throw new Error("ListContainer: sliceName must be the same as refName");
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    modelInsight: `${modelName}Insight`,
    limitOfModel: `limitOf${modelClassName}`,
    sortOfModel: `sortOf${modelClassName}`,
    initModel: `init${modelClassName}`,
    newModel: `new${modelClassName}`,
    refreshModel: `refresh${modelClassName}`,
    setSortOfModel: `setSortOf${modelClassName}`,
    setLimitOfModel: `setLimitOf${modelClassName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    modelInsight: sliceName.replace(names.model, names.modelInsight),
    limitOfModel: sliceName.replace(names.model, names.limitOfModel),
    sortOfModel: sliceName.replace(names.model, names.sortOfModel),
    initModel: sliceName.replace(names.model, names.initModel),
    newModel: sliceName.replace(names.model, names.newModel),
    refreshModel: sliceName.replace(names.model, names.refreshModel),
    setSortOfModel: sliceName.replace(names.model, names.setSortOfModel),
    setLimitOfModel: sliceName.replace(names.model, names.setLimitOfModel),
  };
  const cnst = getCnstMeta(sliceName);

  const limitOfModel = storeUse[namesOfSlice.limitOfModel]();
  const sortOfModel = storeUse[namesOfSlice.sortOfModel]();

  const ModelDashboard = (): JSX.Element => {
    const summary = storeUse.summary();
    const summaryLoading = storeUse.summaryLoading();
    const Stat = renderDashboard;
    if (!Stat) return <></>;
    return (
      <div className="mb-4">
        {!summary || summaryLoading ? <Loading active /> : <Stat summary={summary} hidePresents />}
      </div>
    );
  };
  const RenderQueryMaker = renderQueryMaker;
  const RenderInsight = (): JSX.Element => {
    const modelInsight = storeUse[namesOfSlice.modelInsight]();
    return renderInsight ? renderInsight({ insight: modelInsight }) : <></>;
  };
  const RenderTemplate = renderTemplate;
  const RenderTools = (): JSX.Element => {
    const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, Light>>();
    const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();
    const toolList = modelMapLoading
      ? []
      : [
          ...(Array.isArray(tools) ? tools : tools([...modelMap.values()])),
          {
            render: () => (
              <div
                className="btn btn-sm btn-ghost flex flex-nowrap justify-start gap-2"
                onClick={() => {
                  const header = columns
                    .map((column) => {
                      if (typeof column === "string") return l.field(sliceName as any, column);
                      else if (column.title) return column.title;
                      else return l.field(sliceName as any, column.key as any);
                    })
                    .join("\t");
                  const body = [...modelMap.values()]
                    .map((model) => {
                      const line = columns
                        .map((column) => {
                          if (typeof column === "string") return model[column] as string;
                          else if (column.value) return column.value(model[column.key], model);
                          else if (column.render) return column.render(model[column.key], model);
                          else return model[column.key] as string;
                        })
                        .join("\t");
                      return line;
                    })
                    .join("\n");
                  const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8" });
                  saveAs(blob, `${sliceName}.csv`);
                }}
              >
                <AiOutlineFileExcel />
                <span>Export CSV</span>
              </div>
            ),
          },
          {
            render: () => (
              <div
                className="btn btn-sm btn-ghost flex flex-nowrap justify-start gap-2"
                onClick={() => {
                  const json = JSON.stringify(deepObjectify([...modelMap.values()], { serializable: true }));
                  const blob = new Blob([json], { type: "application/json" });
                  saveAs(blob, `${sliceName}.json`);
                }}
              >
                <AiOutlineFileProtect />
                <span>Export JSON</span>
              </div>
            ),
          },
        ];
    return (
      <Dropdown
        buttonClassName={`btn btn-primary btn-sm ${renderTemplate && create ? "rounded-l-none" : ""}`}
        value={<AiOutlineEllipsis />}
        content={toolList.map((tool) => tool.render())}
      />
    );
  };
  const RenderSort = (): JSX.Element => {
    const sortMap = getFilterSortMap(cnst.Filter);
    return (
      <Select
        className="mx-1 w-36"
        innerClassName="h-8"
        defaultValue={sortOfModel}
        onChange={(sortKey) => void storeDo[namesOfSlice.setSortOfModel](sortKey)}
      >
        {Object.keys(sortMap).map((sortKey) => (
          <Select.Option key={sortKey} value={sortKey}>
            {l.field(sliceName as any, sortKey)}
          </Select.Option>
        ))}
      </Select>
    );
  };
  return (
    <div className={clsx("m-4", className)}>
      <div className="mb-3 flex flex-wrap justify-between">
        <div className="flex pb-1">
          <p className="prose text-lg">
            {title ?? l.field(sliceName as any, "modelName")}
            {/* ({modelInsight.count}) */}
          </p>
          <div className="ml-3 flex items-center">
            {renderTemplate && create ? (
              <button
                onClick={() => void storeDo[namesOfSlice.newModel]()}
                className={`btn btn-sm btn-primary mr-[0.5px] rounded-r-none`}
              >
                <AiOutlinePlus /> {l("shared.new")}
              </button>
            ) : null}
            <RenderTools />
          </div>
        </div>
        <div className="flex">
          <button
            className="btn btn-primary btn-sm btn-square mx-1"
            onClick={() => void storeDo[namesOfSlice.refreshModel]()}
          >
            <AiOutlineRedo className="mx-2" />
          </button>
          <RenderSort />
          <Select
            className="mx-1 w-36"
            innerClassName="h-8"
            value={limitOfModel}
            onChange={(limit) => void storeDo[namesOfSlice.setLimitOfModel](limit)}
          >
            {[10, 20, 50, 100].map((limit, idx) => (
              <Select.Option key={idx} value={limit}>
                {limit}
                {l("shared.perPage")}
              </Select.Option>
            ))}
          </Select>
        </div>
      </div>
      {!query && <ModelDashboard />}
      <QueryMaker className="mb-4" sliceName={sliceName} query={query} />
      <RenderQueryMaker />
      <RenderInsight />
      {type === "card" ? (
        <DataCardList
          sliceName={sliceName}
          renderItem={renderItem ?? (({ [sliceName]: model }) => <div key={model.id}>{model.id}</div>)}
          renderLoading={renderLoading}
          renderTemplate={renderTemplate}
          renderView={renderView}
          renderTitle={renderTitle}
          columns={columns}
          actions={actions}
          cardListClassName={cardListClassName}
        />
      ) : (
        <DataTableList
          columns={columns}
          sliceName={sliceName}
          actions={actions}
          renderTemplate={renderTemplate}
          renderTitle={renderTitle}
          renderView={renderView}
        />
      )}
      <Model.EditModal sliceName={sliceName} renderTitle={renderTitle}>
        {RenderTemplate ? <RenderTemplate /> : null}
      </Model.EditModal>
    </div>
  );
}
