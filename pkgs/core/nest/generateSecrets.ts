import { BackendEnv } from "@core/base";
import { ForwardOptions, ServerOptions, SshOptions, type TunnelOptions, createTunnel } from "tunnel-ssh";
import { createHash } from "crypto";
const generateHexStringFromSeed = (seed: string, length = 256) => {
  let hexString = "";
  let currentSeed = seed;
  while (hexString.length < length * 2) {
    const hash = createHash("sha256").update(currentSeed).digest("hex");
    hexString += hash;
    currentSeed = hash;
  }
  return hexString.substring(0, length * 2);
};

export const generateJwtSecret = (appName: string, environment: "debug" | "develop" | "main" | "testing") => {
  const seed = `${appName}-${environment}-jwt-secret`;
  return generateHexStringFromSeed(seed);
};

export const generateAeskey = (appName: string, environment: "debug" | "develop" | "main" | "testing") => {
  const seed = `${appName}-${environment}-aes-key`;
  return createHash("sha256").update(seed).digest("hex");
};

const DEFAULT_CLOUD_PORT = 30000;
const getEnvironmentPort = (environment: "testing" | "debug" | "develop" | "main") =>
  environment === "main" ? 2000 : environment === "develop" ? 1000 : environment === "debug" ? 0 : 0;
const getServicePort = (appCode: number, service: "redis" | "mongo" | "meili") =>
  (service === "redis" ? 300 : service === "mongo" ? 400 : 500) + (appCode % 10) * 10 + (appCode >= 10 ? 5 : 0);

interface TunnelOption {
  appName: string;
  environment: "testing" | "debug" | "develop" | "main";
  type: "redis" | "mongo" | "meili";
  port: number;
}
const createDatabaseTunnel = async ({ appName, environment, type, port }: TunnelOption) => {
  const tunnelOptions: TunnelOptions = { autoClose: true };
  const sshOptions: SshOptions = {
    host: `${appName}-${environment}.akamir.com`,
    port: 32767,
    username: "root",
    password: "akamir",
  };
  const serverOptions: ServerOptions = { port };
  const forwardOptions: ForwardOptions = {
    srcAddr: "0.0.0.0",
    srcPort: port,
    dstAddr: `${type}-0.${type}-svc.${appName}-${environment}`,
    dstPort: type === "mongo" ? 27017 : type === "redis" ? 6379 : 7700,
  };
  const [server, client] = await createTunnel(tunnelOptions, serverOptions, sshOptions, forwardOptions);
  return `localhost:${port}`;
};

interface RedisEnv {
  appName: string;
  appCode: number;
  environment: "testing" | "debug" | "develop" | "main";
  operationMode: "local" | "edge" | "cloud";
}
export const generateRedisUri = async ({ appName, appCode, environment, operationMode }: RedisEnv) => {
  if (process.env.REDIS_URI) return process.env.REDIS_URI;
  const port =
    operationMode === "local"
      ? DEFAULT_CLOUD_PORT + getEnvironmentPort(environment) + getServicePort(appCode, "redis")
      : 6379;
  const url =
    operationMode === "cloud"
      ? `redis-svc.${appName}-${environment}.svc.cluster.local`
      : operationMode === "local"
        ? await createDatabaseTunnel({ appName, environment, type: "redis", port })
        : "localhost:6379";
  const uri = `redis://${url}`;
  return uri;
};

interface MongoEnv {
  appName: string;
  appCode: number;
  environment: "testing" | "debug" | "develop" | "main";
  operationMode: "local" | "edge" | "cloud";
  password?: string;
}
export const generateMongoUri = async ({ appName, appCode, environment, operationMode, password }: MongoEnv) => {
  if (process.env.MONGO_URI) return process.env.MONGO_URI;
  const record = operationMode === "cloud" ? "mongodb+srv" : "mongodb";
  const port =
    operationMode === "local"
      ? DEFAULT_CLOUD_PORT + getEnvironmentPort(environment) + getServicePort(appCode, "mongo")
      : 27017;
  const url =
    operationMode === "cloud"
      ? `mongo-svc.${appName}-${environment}.svc.cluster.local`
      : operationMode === "local"
        ? await createDatabaseTunnel({ appName, environment, type: "mongo", port })
        : "localhost:27017";
  const usernameEncoded = password ? encodeURIComponent(`${appName}-${environment}-mongo-user`) : null;
  const passwordEncoded = password ? encodeURIComponent(password) : null;
  const dbName = `${appName}-${environment}`;
  const directConnection = operationMode === "cloud" ? false : true;
  const authInfo = usernameEncoded ? `${usernameEncoded}:${passwordEncoded}@` : "";
  const uri = `${record}://${authInfo}${url}/${dbName}?authSource=${dbName}&readPreference=primary&ssl=false&retryWrites=true&directConnection=${directConnection}`;
  return uri;
};

interface MeiliEnv {
  appName: string;
  appCode: number;
  environment: "testing" | "debug" | "develop" | "main";
  operationMode: "local" | "edge" | "cloud";
}
export const generateMeiliUri = ({ appName, appCode, environment, operationMode }: MeiliEnv) => {
  if (process.env.MEILI_URI) return process.env.MEILI_URI;
  const protocol = operationMode === "local" ? "https" : "http";
  const url =
    operationMode === "cloud"
      ? `meili-0.meili-svc.${appName}-${environment}.svc.cluster.local:7700`
      : operationMode === "local"
        ? `${appName}-${environment}.akamir.com/search`
        : "localhost:7700";
  const uri = `${protocol}://${url}`;
  return uri;
};

export const SALT_ROUNDS = 11;

export const generateHost = (env: BackendEnv) => {
  if (process.env.HOST_NAME) return process.env.HOST_NAME;
  else if (env.hostname) return env.hostname;
  else if (env.operationMode === "local") return "localhost";
  else return `${env.appName}-${env.environment}.akamir.com`;
};

export const generateMeiliKey = ({ appName, environment }: { appName: string; environment: string }) => {
  return `meilisearch-key-${appName}-${environment}`;
};
