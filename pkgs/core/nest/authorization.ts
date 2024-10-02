import * as jwt from "jsonwebtoken";
import { AuthenticationError } from "@nestjs/apollo";
import { baseEnv, dayjs, defaultAccount } from "@core/base";
import type { Account } from "../base";

export const verifyToken = (secret: string, authorization: string | undefined): Account => {
  const [type, token] = authorization?.split(" ") ?? [undefined, undefined];
  if (!token || type !== "Bearer") return defaultAccount;
  try {
    const account = jwt.verify(token, secret) as Account;
    if (account.appName !== baseEnv.appName || account.environment !== baseEnv.environment) return defaultAccount;
    const signature =
      account.signature && dayjs(account.signature.expireAt).isAfter(dayjs())
        ? { ...account.signature, expireAt: dayjs(account.signature.expireAt) }
        : undefined;
    return {
      __InternalArg__: "Account",
      self: account.self && !account.self.removedAt ? account.self : undefined,
      myKeyring: account.myKeyring && !account.myKeyring.removedAt ? account.myKeyring : undefined,
      me: account.me && !account.me.removedAt ? account.me : undefined,
      signature,
      appName: account.appName,
      environment: account.environment,
    };
  } catch (e) {
    return defaultAccount;
  }
};

export const allow = (account: Account | null, roles: ("user" | "admin" | "superAdmin")[], userId?: string) => {
  if (!account) throw new AuthenticationError("No Authentication Account");
  for (const role of roles) {
    if (role === "user" && account.self?.roles.includes("user")) return true;
    else if (role === "admin" && account.me?.roles.includes("admin")) return true;
    else if (role === "superAdmin" && account.me?.roles.includes("superAdmin")) return true;
  }
  throw new AuthenticationError(
    `No Authentication With Roles: ${roles.join(", ")}, Your roles are ${[
      ...(account.self?.roles ?? []),
      ...(account.me?.roles ?? []),
    ].join(", ")}${!account.self?.roles.length && !account.me?.roles.length ? " (No Roles)" : ""}`
  );
};
