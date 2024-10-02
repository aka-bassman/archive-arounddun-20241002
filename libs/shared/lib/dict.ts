import { adminDictionary } from "./admin/admin.dictionary";
import { bannerDictionary } from "./banner/banner.dictionary";
import { fileDictionary } from "./file/file.dictionary";
import { keyringDictionary } from "./keyring/keyring.dictionary";
import { notificationDictionary } from "./notification/notification.dictionary";
import { settingDictionary } from "./setting/setting.dictionary";
import { sharedDictionary } from "./_shared/shared.dictionary";
import { summaryDictionary } from "./summary/summary.dictionary";
import { userDictionary } from "./user/user.dictionary";

import * as sig from "./sig";
import { cnst } from "./cnst";
import { dictionaryOf, makeDictionary, makeTrans } from "@core/base";
import { dictionary as util } from "@util";

export const dictionary = makeDictionary(util, {
  ...sharedDictionary,
  // * ==================== Models ==================== * //
  admin: dictionaryOf(adminDictionary, cnst.adminCnst, sig.AdminSignal),
  banner: dictionaryOf(bannerDictionary, cnst.bannerCnst, sig.BannerSignal),
  file: dictionaryOf(fileDictionary, cnst.fileCnst, sig.FileSignal),
  keyring: dictionaryOf(keyringDictionary, cnst.keyringCnst, sig.KeyringSignal),
  notification: dictionaryOf(notificationDictionary, cnst.notificationCnst, sig.NotificationSignal),
  // * ==================== Models ==================== * //

  // * ==================== Extended Models ==================== * //
  setting: dictionaryOf(settingDictionary, cnst.settingCnst, sig.SettingSignal),
  summary: dictionaryOf(summaryDictionary, cnst.summaryCnst, sig.SummarySignal),
  user: dictionaryOf(userDictionary, cnst.userCnst, sig.UserSignal),
  // * ==================== Extended Models ==================== * //

  // * ==================== Scalar Models ==================== * //
  // * ==================== Scalar Models ==================== * //

  // * ==================== Service Models ==================== * //
  // * ==================== Service Models ==================== * //
} as const);
export const { Revert, translate, msg } = makeTrans(dictionary);
