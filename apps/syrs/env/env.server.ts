import type { ModulesOptions } from "../lib/option";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-member-access
export const env = require(`./env.server.${process.env.NEXT_PUBLIC_ENV ?? "testing"}.ts`).env as ModulesOptions;
