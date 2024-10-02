import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";

@Service("ServiceDeskService")
export class ServiceDeskService extends DbService(db.serviceDeskDb) {
  async summarize(): Promise<cnst.ServiceDeskSummary> {
    return {
      ...(await this.serviceDeskModel.getSummary()),
    };
  }
}
