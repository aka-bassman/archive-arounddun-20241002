import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Board)
export class BoardStore extends stateOf(fetch.boardGql, {
  // state
}) {
  // action
}
