import * as db from "../db";
import { BoardService } from "./board.service";
import { BoardSignal } from "./board.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerBoardModule = () =>
  databaseModuleOf(
    {
      constant: cnst.boardCnst,
      database: db.boardDb,
      signal: BoardSignal,
      service: BoardService,
    },
    allSrvs
  );
