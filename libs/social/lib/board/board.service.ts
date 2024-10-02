import * as db from "../db";
import { DbService, Service } from "@core/server";
import { cnst } from "../cnst";

@Service("BoardService")
export class BoardService extends DbService(db.boardDb) {
  async summarize(): Promise<cnst.BoardSummary> {
    return {
      ...(await this.boardModel.getSummary()),
    };
  }
}
