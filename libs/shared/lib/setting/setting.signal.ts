import { DbSignal, Mutation, Query, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Setting)
export class SettingSignal extends DbSignal(cnst.settingCnst, Srvs, {
  guards: { get: Query.Admin, cru: Mutation.Admin },
}) {
  @Query.Public(() => cnst.Setting)
  async getActiveSetting() {
    const setting = await this.settingService.getActiveSetting();
    return resolve<cnst.Setting>(setting);
  }
}
