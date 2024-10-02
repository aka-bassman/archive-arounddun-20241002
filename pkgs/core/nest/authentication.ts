import { type Access as CoreAccess, dayjs } from "../base";
import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";
import { getRequest, getResponse } from "./authGuards";
import UAParser from "ua-parser-js";
import type { Socket } from "socket.io";

export const Account = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const { account } = getRequest(context);
  return account;
});

export const Self = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const { account } = getRequest(context);
  const self = account.self;
  if (!self && !option.nullable) throw new UnauthorizedException("No or Invalid Account in Self (User)");
  return self;
});

export const MyKeyring = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const { account } = getRequest(context);
  const myKeyring = account.myKeyring;
  if (!myKeyring && !option.nullable) throw new UnauthorizedException("No or Invalid Account in MyKeyring (Keyring)");
  return myKeyring;
});

export const Me = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const { account } = getRequest(context);
  const me = account.me;
  if (!me && !option.nullable) throw new UnauthorizedException("No or Invalid Account in Me (Admin)");
  return me;
});

export const UserIp = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const req = getRequest(context);
  const ip = req.ip;
  if (!ip && !option.nullable) throw new UnauthorizedException("Invalid IP");
  return { ip };
});

export const Signature = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const { account } = getRequest(context);
  const signature = account.signature;
  if (!signature && !option.nullable) throw new UnauthorizedException("No or Invalid Account in Signature");
  return signature;
});

export const Access = createParamDecorator((option: { nullable?: boolean }, context: ExecutionContext) => {
  const req = getRequest(context);
  const res = new UAParser(req.userAgent).getResult();
  if (!req.userAgent && !option.nullable) throw new UnauthorizedException("Invalid UserAgent");
  return {
    ...(req.geolocation ? JSON.parse(req.geolocation) : {}),
    osName: res.os.name,
    osVersion: res.os.version,
    browserName: res.browser.name,
    browserVersion: res.browser.version,
    mobileModel: res.device.model,
    mobileVendor: res.device.vendor,
    deviceType: res.device.type ?? "desktop",
    at: dayjs(),
    period: 0,
  } as CoreAccess;
});

export const Req = createParamDecorator((option: unknown, context: ExecutionContext) => {
  return getRequest(context);
});

export const Res = createParamDecorator((option: unknown, context: ExecutionContext): any => {
  return getResponse(context);
});

export const Ws = createParamDecorator((option: unknown, context: ExecutionContext) => {
  const socket: Socket = context.getArgByIndex(0);
  const { __subscribe__ }: { __subscribe__: boolean } = context.getArgByIndex(1);
  return {
    socket,
    subscribe: __subscribe__,
    onDisconnect: (handler: () => void) => {
      socket.on("disconnect", handler);
    },
    onSubscribe: (handler: () => void) => {
      if (__subscribe__) handler();
    },
    onUnsubscribe: (handler: () => void) => {
      if (!__subscribe__) handler();
    },
  };
});
