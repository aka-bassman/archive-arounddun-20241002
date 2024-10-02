"use client";
import { ClientView, ServerView } from "@core/base";
import { Empty, Loading } from "@util/ui";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { capitalize } from "@core/common";
import { clsx } from "@core/client";
import { fetch, st } from "@shared/client";
import { useFetch } from "@core/next";

interface DefaultProps<T extends string, M> {
  className?: string;
  noDiv?: boolean;
  loading?: ReactNode;
  renderView: (model: M) => ReactNode;
}

interface ViewProps<T extends string, Full extends { id: string }> extends DefaultProps<T, Full> {
  view: ClientView<T, Full>;
}

interface RenderProps<T extends string, Full extends { id: string }> extends DefaultProps<T, Full> {
  view: ServerView<T, Full>;
}

function Render<T extends string, Full extends { id: string }>({
  className,
  view,
  noDiv,
  loading,
  renderView,
}: RenderProps<T, Full>) {
  const loaded = useRef(false);
  const storeUse = st.use as { [key: string]: <T>() => T };
  const storeDo = st.do as unknown as { [key: string]: (...args) => Promise<void> };
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  const { refName } = view;
  const model = storeUse[refName]<Full | null>();
  const modelLoading = storeUse[`${refName}Loading`]<string | boolean>();
  const modelObj = view[`${refName}Obj` as `${Uncapitalize<T>}Obj`] as Full;
  const modelViewAt = view[`${refName}ViewAt` as `${Uncapitalize<T>}ViewAt`] as Date;
  if (
    !modelLoading &&
    model?.id === modelObj.id &&
    storeGet<Date>()[`${refName}ViewAt`].getTime() >= modelViewAt.getTime()
  )
    loaded.current = true;

  const modelInit = useMemo(() => {
    if (loaded.current) return model;
    const modelObj = view[`${refName}Obj` as `${Uncapitalize<T>}Obj`] as Full;
    const crystalizeModel = fetch[`crystalize${capitalize(refName)}`] as (model: Full) => Full;
    const crystal = crystalizeModel(modelObj);
    return crystal;
  }, []);

  useEffect(() => {
    if (loaded.current) return;
    const modelViewAt = view[`${refName}ViewAt` as `${Uncapitalize<T>}ViewAt`] as Date;
    st.set({
      [refName]: modelInit,
      [`${refName}Loading`]: false,
      [`${refName}Modal`]: "view",
      [`${refName}ViewAt`]: modelViewAt,
    });
    loaded.current = true;
  }, []);

  const renderModel = loaded.current ? model : modelInit;

  return noDiv && renderModel ? (
    <>{renderView(renderModel)}</>
  ) : renderModel ? (
    <div className={clsx("flex w-full items-center justify-center", className)}>{renderView(renderModel)}</div>
  ) : null;
  // <>{loading}</>
}

export default function View<T extends string, Full extends { id: string }>({
  className,
  view,
  noDiv,
  loading,
  renderView,
}: ViewProps<T, Full>) {
  //get Props
  const props: ViewProps<T, Full> = {
    className,
    view,
    noDiv,
    loading,
    renderView,
  };
  const { fulfilled, value: promiseView } = useFetch(view);

  return fulfilled ? (
    promiseView ? (
      <Render {...props} view={promiseView} />
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
