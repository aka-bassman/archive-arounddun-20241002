import * as admin from "./admin/admin.constant";
import * as banner from "./banner/banner.constant";
import * as file from "./file/file.constant";
import * as keyring from "./keyring/keyring.constant";
import * as notification from "./notification/notification.constant";
import * as setting from "./setting/setting.constant";
import * as summary from "./summary/summary.constant";
import * as user from "./user/user.constant";

import { cnstOf } from "@core/base";
export { cnst as util } from "@util";
export * from "./_shared/shared.constant";
export * from "./admin/admin.constant";
export * from "./file/file.constant";
export * from "./keyring/keyring.constant";
export * from "./user/user.constant";
export * from "./summary/summary.constant";
export * from "./notification/notification.constant";
export * from "./banner/banner.constant";
export * from "./setting/setting.constant";

export const adminCnst = cnstOf(
  "admin" as const,
  admin.AdminInput,
  admin.Admin,
  admin.LightAdmin,
  admin.AdminInsight,
  admin.AdminFilter,
  admin.AdminSummary
);
export const bannerCnst = cnstOf(
  "banner" as const,
  banner.BannerInput,
  banner.Banner,
  banner.LightBanner,
  banner.BannerInsight,
  banner.BannerFilter,
  banner.BannerSummary
);
export const fileCnst = cnstOf(
  "file" as const,
  file.FileInput,
  file.File,
  file.LightFile,
  file.FileInsight,
  file.FileFilter,
  file.FileSummary
);
export const keyringCnst = cnstOf(
  "keyring" as const,
  keyring.KeyringInput,
  keyring.Keyring,
  keyring.LightKeyring,
  keyring.KeyringInsight,
  keyring.KeyringFilter,
  keyring.KeyringSummary
);
export const notificationCnst = cnstOf(
  "notification" as const,
  notification.NotificationInput,
  notification.Notification,
  notification.LightNotification,
  notification.NotificationInsight,
  notification.NotificationFilter,
  notification.NotificationSummary
);

export const settingCnst = cnstOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.LightSetting,
  setting.SettingInsight,
  setting.SettingFilter
);
export const summaryCnst = cnstOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.LightSummary,
  summary.SummaryInsight,
  summary.SummaryFilter
);

export const userCnst = cnstOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.LightUser,
  user.UserInsight,
  user.UserFilter,
  user.UserSummary
);
