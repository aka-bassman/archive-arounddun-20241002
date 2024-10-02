import * as fs from "fs";
import { type AppInfo, type AppSecret, getCredentials, getScriptExecutor } from "@codebase/devkit";
import { v5 as uuid } from "uuid";
interface MongoConnection {
  id: string;
  favorite: {
    name: string;
    color: "color9";
  };
  savedConnectionType: "favorite";
  connectionOptions: {
    connectionString: string;
    sshTunnel?: {
      host: string;
      port: string;
      username: string;
      password: string;
    };
  };
}

interface MongoConnectionList {
  type: "Compass Connections";
  version: { $numberInt: "1" };
  connections: MongoConnection[];
}

const namespace = "00000000-0000-0000-0000-000000000000";
(() => {
  const { workspaceRoot, apps } = getScriptExecutor();
  const appDatas = apps.reduce<{ app: AppInfo; env: "debug" | "develop" | "main"; secret: AppSecret }[]>(
    (acc, app) => [
      ...acc,
      ...(["debug", "develop", "main"] as const).map((env) => ({
        app,
        env,
        secret: getCredentials({ workspaceRoot, projectName: app.appName, environment: env }),
      })),
    ],
    []
  );
  const mongoConnectionList: MongoConnectionList = {
    type: "Compass Connections",
    version: { $numberInt: "1" },
    connections: appDatas.map(({ app, env, secret }) => ({
      id: uuid(`${app.appName}-${env}`, namespace),
      favorite: {
        name: `${app.appName}-${env}`,
        color: "color9",
      },
      savedConnectionType: "favorite",
      connectionOptions: {
        connectionString: `mongodb://${secret.mongo.account.user.username}:${secret.mongo.account.user.password}@mongo-0.mongo-svc.${app.appName}-${env}/?directConnection=true&authSource=${app.appName}-${env}`,
        sshTunnel: {
          host: `${app.appName}-${env}.akamir.com`,
          port: "32767",
          username: "root",
          password: "akamir",
        },
      },
    })),
  };
  fs.writeFileSync(
    `${workspaceRoot}/infra/master/mongo-connections.json`,
    JSON.stringify(mongoConnectionList, null, 2)
  );
})();
