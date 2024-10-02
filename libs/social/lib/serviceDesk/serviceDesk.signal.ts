import { DbSignal, Mutation, Query, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.ServiceDesk)
export class ServiceDeskSignal extends DbSignal(cnst.serviceDeskCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {}
