import * as db from "../db";
import { StoryService } from "./story.service";
import { StorySignal } from "./story.signal";
import { allSrvs } from "../srv";
import { cnst } from "../cnst";
import { databaseModuleOf } from "@core/server";

export const registerStoryModule = () =>
  databaseModuleOf(
    {
      constant: cnst.storyCnst,
      database: db.storyDb,
      signal: StorySignal,
      service: StoryService,
    },
    allSrvs
  );
