import { DbSignal, Mutation, Query, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";
@Signal(() => cnst.Notification)
export class NotificationSignal extends DbSignal(cnst.notificationCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {}
