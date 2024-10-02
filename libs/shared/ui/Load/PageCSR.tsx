"use client";
import { useEffect, useMemo, useState } from "react";

const setFetchedData = (target: (props: any) => JSX.Element | null, data: any) => {
  Reflect.defineMetadata("fetchedData", data, target.prototype as object);
};
const getFetchedData = <T,>(target: (props: any) => JSX.Element | null): T | null => {
  const data = Reflect.getMetadata("fetchedData", target.prototype as object) as T | undefined;
  return data ? data : null;
};

interface PageProps<Return> {
  of: (props: any) => JSX.Element | null;
  loader: () => Promise<Return>;
  render: (data: Return) => JSX.Element;
  // header?: () => JSX.Element | ReactNode;
  noCache?: boolean;
  header?: any; //NavbarProps;
  pageContent?: boolean;
  loading?: () => JSX.Element;
}
export const PageCSR = <Return,>({
  of,
  loader,
  render,
  loading,
  noCache = false,
  header,
  pageContent = true,
}: PageProps<Return>) => {
  const fetchData = useMemo(() => {
    const cachedData = getFetchedData<Return>(of);
    if (!noCache && cachedData) return cachedData;
    else return loader();
  }, []);
  const [fetchState, setFetchState] = useState<{ fulfilled: boolean; value: Return | null }>(
    fetchData instanceof Promise ? { fulfilled: false, value: null } : { fulfilled: true, value: fetchData }
  );
  useEffect(() => {
    if (fetchState.fulfilled || !(fetchData instanceof Promise)) return;
    void (async () => {
      try {
        const ret = await fetchData;
        setFetchState({ fulfilled: true, value: ret });
        setFetchedData(of, ret);
      } catch (err) {
        // onError?.(content);
      }
    })();
  }, []);
  if (!fetchState.fulfilled || !fetchState.value) return loading ? loading() : null;
  else return <>{render(fetchState.value)}</>;
};
