import { AdminAgent, UserAgent } from "@social/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createAdminStory = async (
  adminAgent: AdminAgent,
  board: cnst.Board,
  userAgent: UserAgent
): Promise<cnst.Story> => {
  const storySample = sampleOf(cnst.StoryInput);
  const adminStory = await adminAgent.fetch.createStory({
    ...storySample,
    category: "testCategory",
    type: "admin",
    title: "testTitle",
    content: "testContent",
    rootType: "board",
    root: board.id,
    user: userAgent.user.id,
  });
  return adminStory;
};

export const createUserStory = async (userAgent: UserAgent, board: cnst.Board): Promise<cnst.Story> => {
  const storySample = sampleOf(cnst.StoryInput);
  const userStory = await userAgent.fetch.createStory({
    ...storySample,
    category: "testCategory",
    type: "user",
    title: "testTitle",
    content: "testContent",
    rootType: "board",
    root: board.id,
    user: userAgent.user.id,
  });
  return userStory;
};

export const updateUserStory = async (userAgent: UserAgent, board: cnst.Board): Promise<cnst.Story> => {
  const storySample = sampleOf(cnst.StoryInput);
  const updateStory = await userAgent.fetch.createStory({
    ...storySample,
    category: "testCategory",
    type: "user",
    title: "수정된 타이틀",
    content: "수정된 내용",
    parentType: "board",
    rootType: "board",
    parent: board.id,
    root: board.id,
    user: userAgent.user.id,
  });
  return updateStory;
};

export const removeStory = async (agent: AdminAgent | UserAgent, storyId: string): Promise<cnst.Story> => {
  const removedStory = await agent.fetch.removeStory(storyId);
  return removedStory;
};
