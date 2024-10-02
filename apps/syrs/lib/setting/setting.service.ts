import * as db from "../db";
import { ExtendedSettingService, MixSrvs, Service } from "@core/server";
import { srv as shared } from "@shared/server";
import { srv as social } from "@social/server";

@Service("SettingService")
export class SettingService extends ExtendedSettingService(
  db.settingDb,
  MixSrvs(shared.SettingService, social.SettingService)
) {
  //
}
