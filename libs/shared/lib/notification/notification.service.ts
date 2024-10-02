import * as db from "../db";
import { DbService, Service, Srv, Use } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";
import type { FirebaseApi } from "@util/nest";
@Service("NotificationService")
export class NotificationService extends DbService(db.notificationDb) {
  @Srv() protected readonly fileService: srv.FileService;
  @Use() protected readonly firebaseApi: FirebaseApi;

  async sendPushNotification(notificationInput: db.NotificationInput) {
    const notification = await this.notificationModel.createNotification(notificationInput);
    const image = notification.image ? await this.fileService.getFile(notification.image) : null;
    await this.firebaseApi.send({
      title: notification.title,
      body: notification.content,
      imageUrl: image ? image.url : undefined,
      token: notification.token,
    });
    return notification;
  }
  async summarize(): Promise<cnst.NotificationSummary> {
    return {
      ...(await this.notificationModel.getSummary()),
    };
  }
}
