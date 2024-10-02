export type Environment = "testing" | "debug" | "develop" | "main";
export interface BaseEnv {
  appName: string;
  environment: Environment;
  operationType: "server" | "client";
  operationMode: "local" | "edge" | "cloud";
  networkType: "mainnet" | "testnet" | "debugnet";
}
export type BackendEnv = BaseEnv & {
  hostname: string | null;
  appCode: number;
  mongo: { password?: string };
  port?: number;
  mongoUri?: string;
  redisUri?: string;
  meiliUri?: string;
  onCleanup?: () => Promise<void>;
};

//! Nextjs는 환경변수를 build time에 그냥 하드코딩으로 값을 넣어버림. operationMode같은것들 잘 동작안할 수 있음. 추후 수정 필요.
// https://nextjs.org/docs/app/building-your-application/configuring/environment-variables#runtime-environment-variables
const appName = process.env.NEXT_PUBLIC_APP_NAME ?? process.env.NX_TASK_TARGET_PROJECT ?? "unknown";
if (appName === "unknown")
  throw new Error("environment variable NEXT_PUBLIC_APP_NAME or NX_TASK_TARGET_PROJECT is required");
const environment = (process.env.NEXT_PUBLIC_ENV ?? "debug") as BaseEnv["environment"];
const operationType = typeof window !== "undefined" ? "client" : process.env.NEXT_RUNTIME ? "client" : "server";
const operationMode = (process.env.NEXT_PUBLIC_OPERATION_MODE ?? "cloud") as BaseEnv["operationMode"];
const networkType = (process.env.NEXT_PUBLIC_NETWORK_TYPE ??
  (environment === "main" ? "mainnet" : environment === "develop" ? "testnet" : "debugnet")) as BaseEnv["networkType"];

export const baseEnv: BaseEnv = {
  appName,
  environment,
  operationType,
  operationMode,
  networkType,
} as const;

export type BaseClientEnv = BaseEnv & {
  side: "server" | "client";
  renderMode: "ssr" | "csr";
  websocket: boolean;
  clientHost: string;
  clientPort: number;
  clientHttpProtocol: "http" | "https";
  clientHttpUri: string;
  serverHost: string;
  serverPort: number;
  serverHttpProtocol: "http" | "https";
  serverHttpUri: string;
  serverGraphqlUri: string;
  serverWsProtocol: "ws" | "wss";
  serverWsUri: string;
};

const side = typeof window === "undefined" ? "server" : "client";
const renderMode = (process.env.RENDER_ENV ?? "ssr") as BaseClientEnv["renderMode"];
const clientHost =
  process.env.NEXT_PUBLIC_CLIENT_HOST ??
  (operationMode === "local" || side === "server" ? "localhost" : window.location.hostname);
const clientPort = parseInt(
  process.env.NEXT_PUBLIC_CLIENT_PORT ?? (operationMode === "local" ? (renderMode === "ssr" ? "4200" : "4201") : "443")
);
const clientHttpProtocol = clientHost === "localhost" ? "http" : "https";
const clientHttpUri = `${clientHttpProtocol}://${clientHost}${clientPort === 443 ? "" : `:${clientPort}`}`;
const serverHost =
  process.env.SERVER_HOST ??
  (operationMode === "local"
    ? typeof window === "undefined"
      ? "localhost"
      : window.location.host.split(":")[0]
    : renderMode === "csr"
      ? `${appName}-${environment}.akamir.com`
      : side === "client"
        ? window.location.host.split(":")[0]
        : operationMode === "cloud"
          ? `backend-svc.${appName}-${environment}.svc.cluster.local`
          : "localhost");

const serverPort = parseInt(
  process.env.SERVER_PORT ?? (operationMode === "local" || side === "server" ? "8080" : "443")
);
const serverHttpProtocol =
  operationMode === "local" || side === "server" || serverHost === "localhost" ? "http" : "https";
const serverHttpUri = `${serverHttpProtocol}://${serverHost}${serverPort === 443 ? "" : `:${serverPort}`}/backend`;
const serverGraphqlUri = `${serverHttpUri}/graphql`;
const serverWsProtocol = serverHttpProtocol === "http" ? "ws" : "wss";
const serverWsUri = `${serverWsProtocol}://${serverHost}${serverPort === 443 ? "" : `:${serverPort}`}`;

export const baseClientEnv: BaseClientEnv = {
  ...baseEnv,
  side,
  renderMode,
  websocket: true,
  clientHost,
  clientPort,
  clientHttpProtocol,
  clientHttpUri,
  serverHost,
  serverPort,
  serverHttpProtocol,
  serverHttpUri,
  serverGraphqlUri,
  serverWsProtocol,
  serverWsUri,
} as const;
