import { Cron, LogService, Service, Srv } from "@core/server";
import type * as srv from "../srv";

@Service("SyrsService")
export class SyrsService extends LogService("SyrsService") {
  @Srv() protected readonly summaryService: srv.SummaryService;

  @Cron("0 * * * *")
  async takePeriodicSnapshot() {
    await this.summaryService.makeSummary("periodic");
  }
}
