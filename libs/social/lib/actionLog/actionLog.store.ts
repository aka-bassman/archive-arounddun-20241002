import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.ActionLog)
export class ActionLogStore extends stateOf(fetch.actionLogGql, {
  // state
}) {
  // action
}
