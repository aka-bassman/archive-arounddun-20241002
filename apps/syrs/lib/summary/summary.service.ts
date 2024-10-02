import * as db from "../db";
import { ExtendedSummaryService, MixSrvs, Service, Srv } from "@core/server";
import { srv as shared } from "@shared/server";
import { srv as social } from "@social/server";
import type * as srv from "../srv";

@Service("SummaryService")
export class SummaryService extends ExtendedSummaryService(
  db.summaryDb,
  MixSrvs(shared.SummaryService, social.SummaryService)
) {
          @Srv() protected readonly imageHostingService: srv.ImageHostingService;
@Srv() protected readonly promptService: srv.PromptService;
@Srv() protected readonly resultService: srv.ResultService;
@Srv() protected readonly testService: srv.TestService;
@Srv() protected readonly userService: srv.UserService;

  async getSyrsSummary() {
    return {
            ...(await this.testService.summarize()),
      ...(await this.resultService.summarize()),
      ...(await this.promptService.summarize()),
      ...(await this.imageHostingService.summarize()),
...(await this.userService.summarizeSyrs()),
    };
  }
  async makeSummary(archiveType: "periodic" | "non-periodic" = "non-periodic"): Promise<db.Summary> {
    const summary = {
      ...(await this.getSharedSummary()),
      ...(await this.getSocialSummary()),
      ...(await this.getSyrsSummary()),
    };
    return (await this.summaryModel.archive(archiveType, summary)) as db.Summary;
  }
}
