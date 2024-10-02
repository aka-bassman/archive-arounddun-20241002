import { AppClientEnv } from "./env.client.type";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
export const env = require(`./env.client.${process.env.NEXT_PUBLIC_ENV ?? "testing"}.ts`).env as AppClientEnv;
