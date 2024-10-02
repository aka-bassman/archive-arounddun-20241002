import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Test)
export class TestStore extends stateOf(fetch.testGql, {
  // state
}) {
  // action
}
