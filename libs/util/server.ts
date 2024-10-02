import { ModulesOptions } from "./lib/option";

// * Module Imports
import {
  CacheClient,
  CloudflareApi,
  DatabaseClient,
  DiscordApi,
  FirebaseApi,
  GmailApi,
  IpfsApi,
  ObjectStorageApi,
  PurpleApi,
  SearchClient,
} from "./nest";
import { DynamicModule } from "@nestjs/common";
import { registerLocalFileModule } from "./lib/localFile/_server";
import { registerSearchModule } from "./lib/search/_server";
import { registerSecurityModule } from "./lib/security/_server";
import { useGlobals } from "@core/server";
export { env } from "./env/env.server.testing";
export * as db from "./lib/db";
export * as srv from "./lib/srv";
export * as option from "./lib/option";
export { fetch } from "./lib/fetch";

export const registerModules = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    useGlobals({
      uses: {
        cloudflareApi: new CloudflareApi(options.cloudflare),
        firebaseApi: new FirebaseApi(options.firebase),
        gmailApi: new GmailApi(options.mailer),
        ipfsApi: new IpfsApi(options.ipfs),
        purpleApi: new PurpleApi(options.message),
        objectStorageApi: new ObjectStorageApi(options.appName, options.objectStorage),
      },
      useAsyncs: {
        discordApi: async () => {
          await new DiscordApi(options.discord).initBots();
        },
      },
      injects: { SearchClient, DatabaseClient, CacheClient },
    }),
    registerLocalFileModule(),
    registerSecurityModule(options),
    registerSearchModule(),
  ];
  return modules;
};
export const registerBatches = (options: ModulesOptions, isChild?: boolean) => {
  const modules = [
    //
  ] as DynamicModule[];
  return modules;
};
