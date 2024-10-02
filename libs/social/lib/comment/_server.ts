import * as db from "../db";
import { CommentService } from "./comment.service";
import { CommentSignal } from "./comment.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerCommentModule = () =>
  databaseModuleOf(
    {
      constant: cnst.commentCnst,
      database: db.commentDb,
      signal: CommentSignal,
      service: CommentService,
    },
    allSrvs
  );
