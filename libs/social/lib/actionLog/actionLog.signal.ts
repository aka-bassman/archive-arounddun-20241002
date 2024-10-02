import { DbSignal, Mutation, Query, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.ActionLog)
export class ActionLogSignal extends DbSignal(cnst.actionLogCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {}
