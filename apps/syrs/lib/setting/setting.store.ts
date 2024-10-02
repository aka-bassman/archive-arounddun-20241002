import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch, settingGql } from "../fetch";

@Store(() => cnst.Setting)
export class SettingStore extends stateOf(settingGql, {
  // state
}) {
  async getActiveSetting() {
    this.set({ setting: (await fetch.getActiveSetting()) as cnst.Setting, settingLoading: false });
  }
}
