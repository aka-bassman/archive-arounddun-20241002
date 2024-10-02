"use client";
import { Pagination as Pagn } from "@util/ui";
import { capitalize } from "@core/common";
import { clsx } from "@core/client";
import { st } from "@shared/client";

interface PaginationProps<T extends string> {
  className?: string;
  sliceName: string;
}
export default function Pagination<T extends string, M extends { id: string }, L>({
  className,
  sliceName,
}: PaginationProps<T>) {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const refName = st.slice[sliceName as "admin"].refName;
  const [modelName, modelClassName] = [refName, capitalize(refName)];
  const names = {
    model: modelName,
    modelInsight: `${modelName}Insight`,
    limitOfModel: `limitOf${modelClassName}`,
    lastPageOfModel: `lastPageOf${modelClassName}`,
    pageOfModel: `pageOf${modelClassName}`,
    setPageOfModel: `setPageOf${modelClassName}`,
  };
  const namesOfSlice = {
    modelInsight: sliceName.replace(names.model, names.modelInsight),
    limitOfModel: sliceName.replace(names.model, names.limitOfModel),
    lastPageOfModel: sliceName.replace(names.model, names.lastPageOfModel),
    pageOfModel: sliceName.replace(names.model, names.pageOfModel),
    setPageOfModel: sliceName.replace(names.model, names.setPageOfModel),
  };
  const modelInsight = storeUse[namesOfSlice.modelInsight]<{ count: number }>();
  const limitOfModel = storeUse[namesOfSlice.limitOfModel]<number>();
  const lastPageOfModel = storeUse[namesOfSlice.lastPageOfModel]<number>();
  const pageOfModel = storeUse[namesOfSlice.pageOfModel]<number>();
  return (
    <div className={clsx("mt-4 flex flex-wrap justify-center", className)}>
      <Pagn
        currentPage={pageOfModel}
        // showQuickJumper={lastPageOfModel > 10}
        total={modelInsight.count}
        onPageSelect={(page) => {
          void storeDo[namesOfSlice.setPageOfModel](page);
        }}
        itemsPerPage={limitOfModel || modelInsight.count}
      />
    </div>
  );
}
