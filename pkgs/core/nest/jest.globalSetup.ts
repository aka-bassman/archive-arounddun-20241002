/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */
import "tsconfig-paths/register";
import { TestServer } from "./testServer";
import type { BackendEnv } from "../base";
import type { Config } from "@jest/types";
import type { DynamicModule } from "@nestjs/common";

const setup = async (globalConfig: Config.InitialOptions, projectConfig) => {
  const { env } = require(`${globalConfig.rootDir}/env/env.server.testing`);
  const { fetch, registerModules } = require(`${globalConfig.rootDir}/server`);
  const maxWorkers = globalConfig.maxWorkers;
  if (!maxWorkers) throw new Error("maxWorkers is not defined");
  const testServers = new Array(maxWorkers)
    .fill(0)
    .map((_, idx) => new TestServer(registerModules as (options: any) => DynamicModule[], env as BackendEnv, idx + 1));
  await Promise.all(testServers.map((server) => server.init()));
  global.__TEST_SERVERS__ = testServers;
  global.fetch = fetch;
  global.env = env;
  global.registerModules = registerModules;
};

export default setup;
