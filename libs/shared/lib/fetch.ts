import * as sig from "./sig";
import { cnst } from "./cnst";
import { gqlOf, makeFetch, scalarUtilOf } from "@core/base";
import { fetch as utilFetch } from "@util";

const adminGql = gqlOf(cnst.adminCnst, sig.AdminSignal);
const fileGql = gqlOf(cnst.fileCnst, sig.FileSignal);
const keyringGql = gqlOf(cnst.keyringCnst, sig.KeyringSignal);
const userGql = gqlOf(cnst.userCnst, sig.UserSignal);
const bannerGql = gqlOf(cnst.bannerCnst, sig.BannerSignal);
const settingGql = gqlOf(cnst.settingCnst, sig.SettingSignal);
const summaryGql = gqlOf(cnst.summaryCnst, sig.SummarySignal);
const notificationGql = gqlOf(cnst.notificationCnst, sig.NotificationSignal);

export const fetch = makeFetch(utilFetch, {
  ...adminGql,
  ...fileGql,
  ...keyringGql,
  ...userGql,
  ...bannerGql,
  ...settingGql,
  ...summaryGql,
  ...notificationGql,
  ...scalarUtilOf("fileMeta" as const, cnst.FileMeta),
  ...scalarUtilOf("externalLink" as const, cnst.ExternalLink),
  ...scalarUtilOf("serviceReview" as const, cnst.ServiceReview),
  adminGql,
  fileGql,
  keyringGql,
  userGql,
  bannerGql,
  settingGql,
  summaryGql,
  notificationGql,
});
