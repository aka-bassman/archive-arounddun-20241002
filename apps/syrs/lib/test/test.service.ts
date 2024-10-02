import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";
// import type * as srv from "../srv";

@Service("TestService")
export class TestService extends DbService(db.testDb) {
  // @Use() protected readonly injectedVar: string;
  // @Srv() protected readonly otherService: srv.OtherService;
  
  async summarize(): Promise<cnst.TestSummary> {
    return {
      ...(await this.testModel.getSummary()),
    };
  }
}
