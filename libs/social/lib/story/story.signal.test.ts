import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as boardSpec from "@social/lib/board/board.signal.spec";
import * as storySpec from "@social/lib/story/story.signal.spec";
import * as userSpec from "@shared/lib/user/user.signal.spec";
import { AdminAgent, UserAgent } from "../user/user.signal.spec";
import { cnst } from "../cnst";

describe("StorySignal", () => {
  let adminAgent: AdminAgent, userAgent: UserAgent, board: cnst.Board;
  let adminStory: cnst.Story, userStory: cnst.Story;

  beforeAll(async () => {
    adminAgent = await adminSpec.getAdminAgentWithInitialize();
    userAgent = await userSpec.getUserAgentWithPhone(0);
    board = await boardSpec.createUserBoard(adminAgent);
  });

  it("admin create story", async () => {
    adminStory = await storySpec.createAdminStory(adminAgent, board, userAgent);
    expect(adminStory.type).toEqual("admin");
    expect(adminStory.root).toEqual(board.id);
    expect(adminStory.user?.id).toEqual(userAgent.user.id);
  });

  it("user write story", async () => {
    userStory = await storySpec.createUserStory(userAgent, board);
    expect(userStory.type).toEqual("user");
    expect(userStory.root).toEqual(board.id);
    expect(userStory.user?.id).toEqual(userAgent.user.id);
  });

  it("user update story", async () => {
    const updatedStory = await storySpec.updateUserStory(userAgent, board);
    expect(updatedStory.type).toEqual("user");
    expect(updatedStory.title).toEqual("수정된 타이틀");
    expect(updatedStory.content).toEqual("수정된 내용");
  });

  it("admin delete story", async () => {
    const adminRemovedStory = await storySpec.removeStory(adminAgent, adminStory.id);
    expect(adminRemovedStory.type).toEqual("admin");
    expect(adminRemovedStory.removedAt).toBeTruthy();
  });

  it("user delete story", async () => {
    const userRemovedStory = await storySpec.removeStory(userAgent, userStory.id);
    expect(userRemovedStory.type).toEqual("user");
    expect(userRemovedStory.removedAt).toBeTruthy();
  });
});
