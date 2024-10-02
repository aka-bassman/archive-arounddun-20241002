import { type BackendApp, createNestApp } from "./boot";
import { type BackendEnv } from "@core/base";
import { DynamicModule } from "@nestjs/common";
import { Logger, client, sleep } from "@core/common";
import { MongoMemoryServer } from "mongodb-memory-server";
import { RedisMemoryServer } from "redis-memory-server";
import mongoose from "mongoose";

const MAX_RETRY = 5;
const TEST_LISTEN_PORT_BASE = 38080;
const TEST_MONGODB_PORT_BASE = 38081;
const TEST_REDIS_PORT_BASE = 38082;
const MIN_ACTIVATION_TIME = 0;
const MAX_ACTIVATION_TIME = 30000;

export class TestServer {
  readonly #logger = new Logger("TestServer");
  readonly #mongod: MongoMemoryServer;
  readonly #redis: RedisMemoryServer;
  readonly #registerModules: (options: any) => DynamicModule[];
  readonly #env: BackendEnv;
  workerId: number;
  #startAt = Date.now();
  #app: BackendApp;
  #portOffset = 0;
  static initClient(env: BackendEnv, workerId = parseInt(process.env.JEST_WORKER_ID ?? "0")) {
    if (workerId === 0) throw new Error("TestClient should not be used in main thread");
    const portOffset = workerId * 1000 + env.appCode * 10;
    const port = TEST_LISTEN_PORT_BASE + portOffset;
    const endpoint = `http://localhost:${port}/backend/graphql`;
    client.init({ uri: endpoint });
  }
  constructor(registerModules: (options: any) => DynamicModule[], env: BackendEnv, workerId?: number) {
    this.workerId = workerId ?? parseInt(process.env.JEST_WORKER_ID ?? "0");
    if (this.workerId === 0) throw new Error("TestServer should not be used in main thread");
    this.#portOffset = this.workerId * 1000 + env.appCode * 10;
    this.#mongod = new MongoMemoryServer({ instance: { port: TEST_MONGODB_PORT_BASE + this.#portOffset } });
    this.#redis = new RedisMemoryServer({ instance: { port: TEST_REDIS_PORT_BASE + this.#portOffset } });
    this.#env = { ...env };
    this.#registerModules = registerModules;
  }
  async init() {
    for (let i = 0; i < MAX_RETRY; i++) {
      try {
        const watchdog = setTimeout(() => {
          throw new Error("TestServer Init Timeout");
        }, MAX_ACTIVATION_TIME);
        await this.#init();
        clearTimeout(watchdog);
        return;
      } catch (e) {
        this.#logger.error(e as string);
        await this.terminate();
      }
    }
  }
  async #init() {
    const now = Date.now();
    this.#logger.log(`Test System #${this.workerId} Initializing...`);
    const port = TEST_LISTEN_PORT_BASE + this.#portOffset;
    const [mongoUri, redisHost, redisPort] = await Promise.all([
      this.startMongo(),
      this.#redis.getHost(),
      this.#redis.getPort(),
    ]);
    this.#env.port = port;
    this.#env.mongoUri = mongoUri;
    this.#env.redisUri = `redis://${redisHost}:${redisPort}`;
    this.#env.meiliUri = "http://localhost:7700/search";
    this.#env.onCleanup = async () => {
      await this.cleanup();
    };
    this.#app = await createNestApp({ registerModules: this.#registerModules, env: this.#env });
    this.#logger.log(`Test System #${this.workerId} Initialized, Mongo: ${mongoUri}, Redis: ${redisHost}:${redisPort}`);
    this.#startAt = Date.now();
    this.#logger.log(`Test System #${this.workerId} Activation Time: ${this.#startAt - now}ms`);
  }
  async startMongo() {
    await this.#mongod.start();
    return this.#mongod.getUri();
  }
  async cleanup() {
    const now = Date.now();
    this.#logger.log("Mongo Memory Database Cleaning up...");
    if (this.#mongod.state === "running") {
      await this.#mongod.stop();
      await this.#mongod.start(true);
    }
    this.#logger.log(`Mongo Memory Database Cleaned up in ${Date.now() - now}ms`);
  }
  async terminate() {
    const now = Date.now();
    const elapsed = now - this.#startAt;
    await sleep(50); // cooldown
    client.socket?.close();
    await this.#app.close();
    if (elapsed < MIN_ACTIVATION_TIME) {
      this.#logger.log(`waiting for ${MIN_ACTIVATION_TIME - elapsed}`);
      await sleep(MIN_ACTIVATION_TIME - elapsed);
    }
    await Promise.all([mongoose.disconnect(), this.#mongod.stop(), this.#redis.stop()]);
    this.#logger.log(`System Terminated in ${Date.now() - now}ms`);
  }
}
