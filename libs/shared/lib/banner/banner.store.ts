import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Banner)
export class BannerStore extends stateOf(fetch.bannerGql, {
  // state
}) {
  // action
}
