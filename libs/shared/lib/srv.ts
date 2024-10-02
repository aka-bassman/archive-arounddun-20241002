import { AdminService } from "./admin/admin.service";
import { BannerService } from "./banner/banner.service";
import { FileService } from "./file/file.service";
import { GetServices } from "@core/server";
import { KeyringService } from "./keyring/keyring.service";
import { NotificationService } from "./notification/notification.service";
import { SettingService } from "./setting/setting.service";
import { SummaryService } from "./summary/summary.service";
import { UserService } from "./user/user.service";
import { srv as util } from "@util/server";

export { srv as util } from "@util/server";
export { AdminService } from "./admin/admin.service";
export { BannerService } from "./banner/banner.service";
export { FileService } from "./file/file.service";
export { KeyringService } from "./keyring/keyring.service";
export { NotificationService } from "./notification/notification.service";
export { SettingService } from "./setting/setting.service";
export { SummaryService } from "./summary/summary.service";
export { UserService } from "./user/user.service";

export const allSrvs = {
  ...util.allSrvs,
  AdminService,
  FileService,
  KeyringService,
  UserService,
  SummaryService,
  NotificationService,
  BannerService,
  SettingService,
};
export type AllSrvs = GetServices<typeof allSrvs>;
