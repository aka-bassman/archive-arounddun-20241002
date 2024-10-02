import * as db from "../db";
import { DbService, Service } from "@core/server";

@Service("SettingService")
export class SettingService extends DbService(db.settingDb) {
  protected setting: db.Setting;

  async getActiveSetting() {
    this.setting =
      (await this.settingModel.findByStatuses(["active"])) ??
      (await this.settingModel.createSetting({ resignupDays: 0 }));
    return this.setting;
  }
}
