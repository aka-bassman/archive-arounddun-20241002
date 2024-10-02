import "dayjs/locale/ko";
import { Load } from "../Load";
import { ReactNode } from "react";
import { getAccount } from "@core/client";
import type { BaseClientEnv } from "@core/base";
import type { cnst } from "@shared/client";

export interface ProviderProps {
  className?: string;
  appName: string;
  lang: "en" | "ko";
  head?: JSX.Element;
  env: BaseClientEnv;
  theme?: string;
  prefix?: string;
  usePage?: any;
  fetch: any;
  children: ReactNode | ReactNode[];
  gaTrackingId?: string;
}

export const Common = () => {
  return <></>;
};

export type InitAuthFetchType = typeof window.fetch & {
  me: (props: { crystalize: boolean }) => Promise<cnst.Admin>;
  myKeyring: (props: { crystalize: boolean }) => Promise<cnst.Keyring>;
  whoAmI: (props: { crystalize: boolean }) => Promise<cnst.User>;
};

interface WrapperProps {
  fetch: InitAuthFetchType;
  environment: string;
  render: (props: {
    mePromise: Promise<any>;
    myKeyringPromise: Promise<any>;
    selfPromise: Promise<any>;
  }) => JSX.Element;
}

const CommonWrapper = ({ fetch, environment, render }: WrapperProps) => {
  return (
    <Load.Page
      of={CommonWrapper}
      loader={async () => {
        const account = getAccount();
        const mePromise = (async () => {
          try {
            return account.me ? await fetch.me({ crystalize: false }) : null;
          } catch (e) {
            return null;
          }
        })();
        const myKeyringPromise = (async () => {
          try {
            return account.myKeyring ? await fetch.myKeyring({ crystalize: false }) : null;
          } catch (e) {
            return null;
          }
        })();
        const selfPromise = (async () => {
          try {
            return account.self ? await fetch.whoAmI({ crystalize: false }) : null;
          } catch (e) {
            return null;
          }
        })();
        return Promise.resolve({ mePromise, myKeyringPromise, selfPromise });
      }}
      render={render}
    />
  );
};
Common.Wrapper = CommonWrapper;
