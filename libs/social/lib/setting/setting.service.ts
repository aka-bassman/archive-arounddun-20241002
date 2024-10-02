import * as db from "../db";
import { ExtendedSettingService, Service } from "@core/server";
import { srv as shared } from "@shared/server";

@Service("SettingService")
export class SettingService extends ExtendedSettingService(db.settingDb, shared.SettingService) {
  //
}
