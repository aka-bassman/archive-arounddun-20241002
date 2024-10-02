import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";
// import type * as srv from "../srv";

@Service("PromptService")
export class PromptService extends DbService(db.promptDb) {
  // @Use() protected readonly injectedVar: string;
  // @Srv() protected readonly otherService: srv.OtherService;

  async summarize(): Promise<cnst.PromptSummary> {
    return {
      ...(await this.promptModel.getSummary()),
    };
  }

  async getDefaultPrompt() {
    return await this.promptModel.getDefaultPrompt();
  }
}
