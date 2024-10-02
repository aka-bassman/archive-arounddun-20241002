"use client";
import { ClientInit, ServerInit } from "@core/base";
import { Empty, Loading, More } from "@util/ui";
import { MutableRefObject, ReactNode, useEffect, useMemo, useRef } from "react";
import { capitalize, isQueryEqual, lowerlize } from "@core/common";
import { clsx } from "@core/client";
import { fetch, st } from "@shared/client";
import { useFetch } from "@core/next";

interface DefaultProps<L> {
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  className?: string;
  style?: React.CSSProperties;
  noDiv?: boolean;
  from?: number;
  to?: number;
  loading?: ReactNode;
  filter?: (item: L, idx: number) => boolean;
  sort?: (a: L, b: L) => number;
  renderEmpty?: null | (() => ReactNode);
  renderItem?: (item: L, idx: number) => ReactNode;
  renderList?: (list: L[]) => ReactNode;
  reverse?: boolean;
  pagination?: boolean;
}

interface UnitsProps<T extends string, M extends { id: string }, L> extends DefaultProps<L> {
  init: ClientInit<T, L>;
}

interface RenderProps<T extends string, M extends { id: string }, L> extends DefaultProps<L> {
  init: ServerInit<T, L>;
}

function Render<T extends string, M extends { id: string }, L extends { id: string }>({
  containerRef,
  className,
  style,
  init,
  noDiv,
  from,
  to,
  loading,
  renderItem,
  renderList,
  renderEmpty = noDiv
    ? () => null
    : () => (
        <div className="grid size-full place-items-center">
          <Empty />
        </div>
      ),
  filter = () => true,
  sort = (a, b) => 1,
  reverse,
  pagination,
}: RenderProps<T, M, L>) {
  const loaded = useRef(false);
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const { refName, sliceName } = init;
  const [modelName, ModelName] = [lowerlize(refName), capitalize(refName)];
  const names = {
    model: modelName,
    modelMap: `${modelName}Map`,
    modelMapLoading: `${modelName}MapLoading`,
    modelInsight: `${modelName}Insight`,
    modelInitMap: `${modelName}InitMap`,
    modelInitAt: `${modelName}InitAt`,
    modelObjList: `${modelName}ObjList`,
    modelObjInsight: `${modelName}ObjInsight`,
    lightCrystalizeModel: `lightCrystalize${ModelName}`,
    crystalizeModelInsight: `crystalize${ModelName}Insight`,
    pageOfModel: `pageOf${ModelName}`,
    lastPageOfModel: `lastPageOf${ModelName}`,
    limitOfModel: `limitOf${ModelName}`,
    queryArgsOfModel: `queryArgsOf${ModelName}`,
    sortOfModel: `sortOf${ModelName}`,
    setPageOfModel: `setPageOf${ModelName}`,
    addPageOfModel: `addPageOf${ModelName}`,
  };
  const namesOfSlice = {
    modelMap: sliceName.replace(names.model, names.modelMap),
    modelMapLoading: sliceName.replace(names.model, names.modelMapLoading),
    modelInitMap: sliceName.replace(names.model, names.modelInitMap),
    modelInitAt: sliceName.replace(names.model, names.modelInitAt),
    modelInsight: sliceName.replace(names.model, names.modelInsight),
    pageOfModel: sliceName.replace(names.model, names.pageOfModel),
    lastPageOfModel: sliceName.replace(names.model, names.lastPageOfModel),
    limitOfModel: sliceName.replace(names.model, names.limitOfModel),
    queryArgsOfModel: sliceName.replace(names.model, names.queryArgsOfModel),
    sortOfModel: sliceName.replace(names.model, names.sortOfModel),
    setPageOfModel: sliceName.replace(names.model, names.setPageOfModel),
    addPageOfModel: sliceName.replace(names.model, names.addPageOfModel),
  };
  const modelMap = storeUse[namesOfSlice.modelMap]<Map<string, L>>();
  const modelMapLoading = storeUse[namesOfSlice.modelMapLoading]<string | boolean>();
  const initQueryArgs = init[names.queryArgsOfModel] as object[];
  const initModelInitAt = init[names.modelInitAt] as Date;
  const initModelObjInsight = init[names.modelObjInsight] as { count: number };
  const initLimitOfModel = init[names.limitOfModel] as number;
  const initPageOfModel = init[names.pageOfModel] as number;
  if (
    !modelMapLoading &&
    isQueryEqual(storeGet<object[]>()[namesOfSlice.queryArgsOfModel], initQueryArgs) &&
    storeGet<Date>()[namesOfSlice.modelInitAt].getTime() >= initModelInitAt.getTime()
  )
    loaded.current = true;

  const modelInitMap = useMemo<Map<string, L>>(() => {
    if (loaded.current) return modelMap;
    const initModelObjList = init[names.modelObjList] as L[];
    const lightCrystalizeModel = fetch[names.lightCrystalizeModel] as (model: L) => L;
    return new Map<string, L>(initModelObjList.map((model) => [model.id, lightCrystalizeModel(model)]));
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    const modelObjInsight = init[names.modelObjInsight] as { count: number };
    const crystalizeModelInsight = fetch[names.crystalizeModelInsight] as (insight: { count: number }) => {
      count: number;
    };
    const insight = crystalizeModelInsight(modelObjInsight);
    const initPageOfModel = init[names.pageOfModel] as number;
    const initLastPageOfModel = init[names.lastPageOfModel] as number;
    const initLimitOfModel = init[names.limitOfModel] as number;
    const initQueryArgsOfModel = init[names.queryArgsOfModel] as object[];
    const initSortOfModel = init[names.sortOfModel] as string;
    st.set({
      [namesOfSlice.modelMap]: modelInitMap,
      [namesOfSlice.modelInitMap]: modelInitMap,
      [namesOfSlice.modelInitAt]: initModelInitAt,
      [namesOfSlice.modelMapLoading]: false,
      [namesOfSlice.modelInsight]: insight,
      [namesOfSlice.pageOfModel]: initPageOfModel,
      [namesOfSlice.lastPageOfModel]: initLastPageOfModel,
      [namesOfSlice.limitOfModel]: initLimitOfModel,
      [namesOfSlice.queryArgsOfModel]: initQueryArgsOfModel,
      [namesOfSlice.sortOfModel]: initSortOfModel,
    });
    loaded.current = true; //! 버그날수도 있슴
  }, []);

  const modelInsight = storeUse[namesOfSlice.modelInsight]<{ count: number }>();
  const limitOfModel = storeUse[namesOfSlice.limitOfModel]<number>();
  const pageOfModel = storeUse[namesOfSlice.pageOfModel]<number>();
  const insight = loaded.current ? modelInsight : initModelObjInsight;
  const limit = loaded.current ? limitOfModel : initLimitOfModel;
  const page = loaded.current ? pageOfModel : initPageOfModel;
  const moreProps = {
    total: insight.count,
    currentPage: page,
    itemsPerPage: limit || insight.count,
    onAddPage: async (page) => {
      await storeDo[namesOfSlice.addPageOfModel](page);
    },
    onPageSelect: (page: number) => {
      void storeDo[namesOfSlice.setPageOfModel](page);
      // if (scrollToTop) {
      window.parent.postMessage({ type: "pathChange", page }, "*");
      window.scrollTo({ top: 0, behavior: "instant" });
      // }
    },
    reverse,
  };

  const modelList = !loaded.current
    ? [...modelInitMap.values()].filter(filter).sort(sort)
    : [...modelMap.values()].filter(filter).sort(sort);

  if (renderList)
    return (
      <>
        {modelList.length ? (
          <ContainerWrapper
            containerRef={containerRef}
            className={clsx(className, {
              "grid-cols-1 md:grid-cols-1 lg:grid-cols-1": modelList.length === 0,
            })}
            noDiv={noDiv}
            pagination={pagination}
            moreProps={moreProps}
          >
            {renderList(modelList)}
          </ContainerWrapper>
        ) : typeof renderEmpty === "function" ? (
          renderEmpty()
        ) : null}
        {modelMapLoading ? (loading ?? <Loading.Area />) : null}
      </>
    );
  else if (!renderItem) throw new Error("renderItem is required");
  const RenderItem = ({ model, idx }: { model: L; idx: number }) => renderItem(model, idx);

  return (
    <>
      <ContainerWrapper
        containerRef={containerRef}
        className={className}
        noDiv={noDiv}
        pagination={pagination}
        moreProps={moreProps}
      >
        {modelList.length
          ? (reverse ? [...modelList].reverse() : modelList)
              .slice(from ?? 0, to ?? modelList.length + 1)
              .map((model, idx) => <RenderItem key={model.id} model={model} idx={idx} />)
          : typeof renderEmpty === "function"
            ? renderEmpty()
            : null}
      </ContainerWrapper>
      {modelMapLoading ? (loading ?? <Loading.Area />) : null}
    </>
  );
}

export default function Units<T extends string, M extends { id: string }, L extends { id: string }>({
  containerRef,
  className,
  init,
  noDiv,
  from,
  to,
  loading,
  renderItem,
  renderList,
  renderEmpty = noDiv
    ? () => null
    : () => (
        <div className="grid size-full place-items-center">
          <Empty />
        </div>
      ),
  filter = () => true,
  sort = (a, b) => 1,
  reverse,
  style,
  pagination = true,
}: UnitsProps<T, M, L>) {
  const props: UnitsProps<T, M, L> = {
    containerRef,
    className,
    style,
    init,
    noDiv,
    from,
    to,
    loading,
    renderItem,
    renderList,
    renderEmpty,
    filter,
    sort,
    reverse,
    pagination,
  };

  const { fulfilled, value: promiseInit } = useFetch(init);

  return fulfilled ? (
    promiseInit ? (
      <Render {...props} init={promiseInit} />
    ) : renderEmpty ? (
      <>{renderEmpty()}</>
    ) : (
      <div className="grid size-full place-items-center">
        <Empty />
      </div>
    )
  ) : loading ? (
    <>{loading}</>
  ) : (
    <div className="grid size-full place-items-center">
      <Loading active />
    </div>
  );
}

interface MoreProps {
  total: number;
  itemsPerPage: number;
  currentPage: number;
  onAddPage: (page: any) => Promise<void>;
  onPageSelect: (page: any) => void;
  children?: React.ReactNode;
  className?: string;
  reverse?: boolean;
}

interface MoreWrapperProps {
  children: ReactNode;
  pagination?: boolean;
  moreProps: MoreProps;
}
const MoreWrapper = ({ children, pagination, moreProps }) =>
  pagination ? <More {...moreProps}>{children}</More> : <>{children}</>;

interface ContainerWrapperProps {
  children: ReactNode;
  className?: string;
  containerRef?: MutableRefObject<HTMLDivElement | null>;
  noDiv?: boolean;
  pagination?: boolean;
  moreProps: MoreProps;
}
const ContainerWrapper = ({
  children,
  className,
  containerRef,
  noDiv,
  pagination,
  moreProps,
}: ContainerWrapperProps) =>
  noDiv ? (
    <MoreWrapper pagination={pagination} moreProps={moreProps}>
      {children}
    </MoreWrapper>
  ) : (
    <div ref={containerRef} className={className}>
      <MoreWrapper pagination={pagination} moreProps={moreProps}>
        {children}
      </MoreWrapper>
    </div>
  );
