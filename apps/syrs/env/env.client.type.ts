import type { BaseClientEnv } from "@core/base";
export type AppClientEnv = BaseClientEnv & {
  google: {
    mapKey: string;
  };
  cloudflare: {
    siteKey: string;
  };
};
