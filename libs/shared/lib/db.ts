import * as admin from "./admin/admin.document";
import * as banner from "./banner/banner.document";
import * as file from "./file/file.document";
import * as keyring from "./keyring/keyring.document";
import * as notification from "./notification/notification.document";
import * as setting from "./setting/setting.document";
import * as summary from "./summary/summary.document";
import * as user from "./user/user.document";
import { cnst } from "./cnst";
import { dbOf } from "@core/server";

export type * from "./_shared/shared.document";
export type * from "./file/file.document";
export type * from "./admin/admin.document";
export type * from "./banner/banner.document";
export type * from "./keyring/keyring.document";
export type * from "./user/user.document";
export type * from "./summary/summary.document";
export type * from "./notification/notification.document";
export type * from "./setting/setting.document";

export const adminDb = dbOf(
  "admin" as const,
  admin.AdminInput,
  admin.Admin,
  admin.AdminModel,
  admin.AdminMiddleware,
  cnst.Admin,
  cnst.AdminInsight,
  cnst.AdminFilter,
  cnst.AdminSummary
);

export const bannerDb = dbOf(
  "banner" as const,
  banner.BannerInput,
  banner.Banner,
  banner.BannerModel,
  banner.BannerMiddleware,
  cnst.Banner,
  cnst.BannerInsight,
  cnst.BannerFilter,
  cnst.BannerSummary
);

export const fileDb = dbOf(
  "file" as const,
  file.FileInput,
  file.File,
  file.FileModel,
  file.FileMiddleware,
  cnst.File,
  cnst.FileInsight,
  cnst.FileFilter,
  cnst.FileSummary
);
export const keyringDb = dbOf(
  "keyring" as const,
  keyring.KeyringInput,
  keyring.Keyring,
  keyring.KeyringModel,
  keyring.KeyringMiddleware,
  cnst.Keyring,
  cnst.KeyringInsight,
  cnst.KeyringFilter,
  cnst.KeyringSummary
);
export const notificationDb = dbOf(
  "notification" as const,
  notification.NotificationInput,
  notification.Notification,
  notification.NotificationModel,
  notification.NotificationMiddleware,
  cnst.Notification,
  cnst.NotificationInsight,
  cnst.NotificationFilter,
  cnst.NotificationSummary
);

export const settingDb = dbOf(
  "setting" as const,
  setting.SettingInput,
  setting.Setting,
  setting.SettingModel,
  setting.SettingMiddleware,
  cnst.Setting,
  cnst.SettingInsight,
  cnst.SettingFilter
);
export const summaryDb = dbOf(
  "summary" as const,
  summary.SummaryInput,
  summary.Summary,
  summary.SummaryModel,
  summary.SummaryMiddleware,
  cnst.Summary,
  cnst.SummaryInsight,
  cnst.SummaryFilter
);
export const userDb = dbOf(
  "user" as const,
  user.UserInput,
  user.User,
  user.UserModel,
  user.UserMiddleware,
  cnst.User,
  cnst.UserInsight,
  cnst.UserFilter,
  cnst.UserSummary
);
