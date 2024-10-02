import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.File)
export class FileStore extends stateOf(fetch.fileGql, {
  // state
}) {
  // action
}
