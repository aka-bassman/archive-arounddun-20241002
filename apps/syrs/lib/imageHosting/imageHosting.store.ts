import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.ImageHosting)
export class ImageHostingStore extends stateOf(fetch.imageHostingGql, {
  // state
}) {
  // action
}
