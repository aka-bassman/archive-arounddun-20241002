/* eslint-disable @typescript-eslint/no-var-requires */
import { type Client as GqlClient, cacheExchange, createClient, fetchExchange } from "@urql/core";
import { Logger } from "./Logger";
import { type Socket, io } from "socket.io-client";
import { baseClientEnv, baseEnv } from "../base/baseEnv";
import { sleep } from "./sleep";

class Client {
  static globalSockets: Socket[] = [];
  static tokenStore = new Map<Client, string>();

  async waitUntilWebSocketConnected() {
    if (baseClientEnv.side === "server") return true;
    while (!this.socket?.connected) {
      Logger.verbose("waiting for websocket to initialize...");
      await sleep(300);
    }
  }
  isInitialized = false;
  uri = baseClientEnv.serverGraphqlUri;
  ws = baseClientEnv.serverWsUri;
  gql: GqlClient = createClient({ url: this.uri, fetch, exchanges: [cacheExchange, fetchExchange] });
  jwt = null as string | undefined | null;
  getJwt(): string | null {
    const isNextServer = baseClientEnv.side === "server" && baseEnv.operationType === "client";
    if (isNextServer) {
      const nextHeaders = require("next/headers") as { cookies?: () => Map<string, { value: string }> };
      return nextHeaders.cookies?.().get("jwt")?.value ?? this.jwt ?? null;
    } else return Client.tokenStore.get(this) ?? null;
  }
  socket: Socket | null = null;
  init(data: Partial<Client> = {}) {
    Object.assign(this, data);
    this.setLink(data.uri);
    this.setSocket(data.ws);
    this.isInitialized = true;
  }
  setSocket(ws = baseClientEnv.serverWsUri) {
    this.ws = ws;
    setTimeout(() => {
      this.socket = io(ws, {
        transports: ["websocket"],
      });
      Client.globalSockets.push(this.socket);
    }, 50);
  }
  setLink(uri = baseClientEnv.serverGraphqlUri) {
    this.uri = uri;
    this.gql = createClient({
      url: this.uri,
      fetch,
      exchanges: [cacheExchange, fetchExchange],
      // requestPolicy: "network-only",
      fetchOptions: () => {
        return {
          headers: {
            "apollo-require-preflight": "true",
            ...(this.jwt ? { authorization: `Bearer ${this.jwt}` } : {}),
          },
        };
      },
    });
  }
  setJwt(jwt: string) {
    Client.tokenStore.set(this, jwt);
  }
  reset() {
    this.socket?.disconnect();
    this.socket = null;
    this.jwt = null;
  }
  clone(data: Partial<Client> = {}) {
    const newClient = new Client();
    newClient.init({ ...this, ...data });
    if (data.jwt) Client.tokenStore.set(newClient, data.jwt);
    return newClient;
  }
  terminate() {
    this.reset();
    while (Client.globalSockets.length) {
      Client.globalSockets.pop()?.disconnect();
    }
    this.isInitialized = false;
  }
}

export const client = new Client();
export type { Client };
