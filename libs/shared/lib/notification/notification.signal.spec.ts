import * as userSpec from "@shared/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createNotification = async (
  adminAgent: userSpec.AdminAgent,
  userAgent: userSpec.UserAgent
): Promise<cnst.Notification> => {
  const notificationInput = sampleOf(cnst.NotificationInput);
  const notification = await adminAgent.fetch.createNotification(notificationInput);
  return notification;
};
