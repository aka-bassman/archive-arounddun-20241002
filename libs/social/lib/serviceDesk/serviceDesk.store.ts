import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.ServiceDesk)
export class ServiceDeskStore extends stateOf(fetch.serviceDeskGql, {
  // state
}) {
  // action
}
