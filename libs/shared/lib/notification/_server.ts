import * as db from "../db";
import { NotificationService } from "./notification.service";
import { NotificationSignal } from "./notification.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerNotificationModule = () =>
  databaseModuleOf(
    {
      constant: cnst.notificationCnst,
      database: db.notificationDb,
      signal: NotificationSignal,
      service: NotificationService,
    },
    allSrvs
  );
