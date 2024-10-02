import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as boardSpec from "@social/lib/board/board.signal.spec";
import * as commentSpec from "@social/lib/comment/comment.signal.spec";
import * as storySpec from "@social/lib/story/story.signal.spec";
import * as userSpec from "@shared/lib/user/user.signal.spec";
import { AdminAgent, UserAgent } from "../user/user.signal.spec";
import { cnst } from "../cnst";

describe("CommentSignal", () => {
  let adminAgent: AdminAgent,
    userAgent: UserAgent,
    userAgent2: UserAgent,
    board: cnst.Board,
    adminComment: cnst.Comment,
    userComment: cnst.Comment,
    replyComment: cnst.Comment,
    story: cnst.Story;

  beforeAll(async () => {
    adminAgent = await adminSpec.getAdminAgentWithInitialize();
    userAgent = await userSpec.getUserAgentWithPhone(0);
    userAgent2 = await userSpec.getUserAgentWithPhone(1);
    board = await boardSpec.createUserBoard(adminAgent);
    story = await storySpec.createAdminStory(adminAgent, board, userAgent);
  });

  it("admin generate comment", async () => {
    adminComment = await commentSpec.createAdminComment(adminAgent, userAgent, story);
    expect(adminComment.group).toEqual("admin");
    expect(adminComment.type).toEqual("admin");
  });

  it("user write comment", async () => {
    userComment = await commentSpec.createUserComment(userAgent, story);
    expect(userComment.group).toEqual("user");
    expect(userComment.type).toEqual("user");
  });

  it("update user comment", async () => {
    userComment = await commentSpec.updateUserComment(userAgent, story);
    expect(userComment.name).toEqual("updatedName");
    expect(userComment.content).toEqual("updatedContent");
    expect(userComment.group).toEqual("user");
    expect(userComment.type).toEqual("user");
  });

  it("user deletes commnet", async () => {
    const userRemovedComment = await commentSpec.removeComment(userAgent, userComment.id);
    expect(userRemovedComment.status).toEqual("removed");
  });

  it("admin deletes the user comment", async () => {
    const adminRemovedComment = await commentSpec.removeComment(adminAgent, userComment.id);
    expect(adminRemovedComment.status).toEqual("removed");
  });

  it("other user responed to user writed comment", async () => {
    userComment = await commentSpec.createUserComment(userAgent, story);
    replyComment = await commentSpec.replyComment(userAgent2, userComment);

    expect(replyComment.root).toEqual(userComment.id);
  });
});
