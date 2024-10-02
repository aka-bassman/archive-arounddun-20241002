import * as db from "../db";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("SummaryService")
export class SummaryService extends DbService(db.summaryDb) {
  @Srv() protected readonly bannerService: srv.BannerService;
  @Srv() protected readonly adminService: srv.AdminService;
  @Srv() protected readonly fileService: srv.FileService;
  @Srv() protected readonly keyringService: srv.KeyringService;
  @Srv() protected readonly notificationService: srv.NotificationService;
  @Srv() protected readonly userService: srv.UserService;
  protected summary: db.Summary;

  async getSharedSummary(): Promise<cnst.SharedSummary> {
    return {
      ...(await this.adminService.summarize()),
      ...(await this.notificationService.summarize()),
      ...(await this.fileService.summarize()),
      ...(await this.keyringService.summarize()),
      ...(await this.bannerService.summarize()),
      ...(await this.userService.summarizeShared()),
    };
  }

  async getActiveSummary() {
    this.summary =
      (await this.summaryModel.findByStatuses(["active"])) ??
      (await this.summaryModel.createSummary({ type: "non-periodic", status: "active" }));
    return this.summary;
  }
}
