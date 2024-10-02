import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import type * as db from "../db";

@Database.Input(() => cnst.BoardInput)
export class BoardInput extends Input(cnst.BoardInput) {}

@Database.Document(() => cnst.Board)
export class Board extends Document(cnst.Board) {
  isGranted(creator?: db.User | null) {
    if (this.roles.includes("guest")) return true;
    else if (!creator) return false;
    else if (this.roles.some((role) => creator.roles.includes(role))) return true;
    else if (creator.roles.includes("admin")) return true;
    else return false;
  }
}

@Database.Model(() => cnst.Board)
export class BoardModel extends Model(Board, cnst.boardCnst) {
  async getSummary(): Promise<cnst.BoardSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Board)
export class BoardMiddleware extends Middleware(BoardModel, Board) {
  onSchema(schema: SchemaOf<BoardModel, Board>) {
    schema.index({ name: "text", description: "text", categories: "text" });
  }
}
