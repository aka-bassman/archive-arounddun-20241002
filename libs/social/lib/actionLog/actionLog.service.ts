import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";
@Service("ActionLogService")
export class ActionLogService extends DbService(db.actionLogDb) {
  async queryLoad(query: { action: string; user: string; target: string }) {
    return await this.actionLogModel.actionLogQueryLoader.load(query);
  }
  async add(data: db.ActionLogInput) {
    const actionLog = await this.actionLogModel.browse(data);
    return await actionLog.addValue();
  }
  async sub(data: db.ActionLogInput) {
    const actionLog = await this.actionLogModel.browse(data);
    return await actionLog.subValue();
  }
  async set(data: db.ActionLogInput, value: number) {
    const actionLog = await this.actionLogModel.browse(data);
    return await actionLog.setValue(value);
  }
  async summarize(): Promise<cnst.ActionLogSummary> {
    return {
      ...(await this.actionLogModel.getSummary()),
    };
  }
}
