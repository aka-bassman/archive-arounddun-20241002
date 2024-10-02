import * as Auth from "./authorization";
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { Account as SerAccount } from "../base";
import type { Socket } from "socket.io";

export interface RequestContext {
  account: SerAccount;
  ip?: string;
  userAgent?: string;
  geolocation?: string;
  headers: Record<string, string | undefined>;
  cookies?: Record<string, string>;
}
export interface ReqType {
  method: string;
  url: string;
  params: object;
  query: object;
  body: object;
}
export interface GqlReqType {
  parentType?: { name?: string };
  fieldName?: string;
}
export const getRequest = <T = RequestContext>(context: ExecutionContext): T => {
  const type = context.getType();
  if (type === "ws") throw new Error("Getting Request in Websocket is not allowed");
  return type === "http"
    ? context.switchToHttp().getRequest<T>()
    : GqlExecutionContext.create(context).getContext<{ req: T }>().req;
};
export const getResponse = <T = any>(context: ExecutionContext): T => {
  const type = context.getType();
  if (type === "ws") throw new Error("Getting Response in Websocket is not allowed");
  return type === "http"
    ? context.switchToHttp().getResponse<T>()
    : GqlExecutionContext.create(context).getContext<{ req: { res: T } }>().req.res;
};
export const getArgs = <T extends { [key: string]: any } = { [key: string]: any }>(context: ExecutionContext): T => {
  const type = context.getType<"http" | "ws" | "graphql" | "unknown">();
  if (type === "ws") throw new Error("Getting Args in Websocket is not allowed");
  if (type === "graphql") return GqlExecutionContext.create(context).getArgs<T>();
  else if (type === "http") {
    const { params, query, body } = context.switchToHttp().getRequest<ReqType>();
    return { ...params, ...query, ...body } as T;
  } else throw new Error("Getting Args in Unknown context is not allowed");
};
export const getSocket = (context: ExecutionContext) => {
  const type = context.getType();
  if (type !== "ws") throw new Error("Getting Socket in Http or GraphQL is not allowed");
  const socket: Socket = context.getArgByIndex(0);
  return socket;
};

@Injectable()
export class Public implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

@Injectable()
export class None implements CanActivate {
  canActivate(): boolean {
    return false;
  }
}

@Injectable()
export class Every implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = getRequest(context);
    return Auth.allow(account, ["user", "admin", "superAdmin"]);
  }
}

@Injectable()
export class Owner implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = getRequest(context);
    return Auth.allow(account, ["user", "admin", "superAdmin"]);
  }
}

@Injectable()
export class Admin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = getRequest(context);
    return Auth.allow(account, ["admin", "superAdmin"]);
  }
}

@Injectable()
export class SuperAdmin implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = getRequest(context);
    return Auth.allow(account, ["superAdmin"]);
  }
}

@Injectable()
export class User implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { account } = getRequest(context);
    return Auth.allow(account, ["user"]);
  }
}
