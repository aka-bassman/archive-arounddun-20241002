import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as userSpec from "@shared/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

export * from "@shared/lib/user/user.signal.spec";
export type UserAgent = userSpec.UserAgent<typeof fetch, cnst.User, cnst.UserInput>;
export type AdminAgent = adminSpec.AdminAgent<typeof fetch>;
