import { AdminAgent, UserAgent } from "../user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createAdminComment = async (
  adminAgent: AdminAgent,
  userAgent: UserAgent,
  story: cnst.Story
): Promise<cnst.Comment> => {
  const commentSample = sampleOf(cnst.CommentInput);
  const adminComment = await adminAgent.fetch.createComment({
    ...commentSample,
    rootType: "story",
    root: story.id,
    group: "admin",
    type: "admin",
    user: userAgent.user.id,
  });
  return adminComment;
};

export const createUserComment = async (userAgent: UserAgent, story: cnst.Story): Promise<cnst.Comment> => {
  const commentSample = sampleOf(cnst.CommentInput);
  const userComment = await userAgent.fetch.createComment({
    ...commentSample,
    rootType: "story",
    root: story.id,
    group: "user",
    type: "user",
    user: userAgent.user.id,
  });
  return userComment;
};

export const updateUserComment = async (userAgent: UserAgent, story: cnst.Story): Promise<cnst.Comment> => {
  const commentSample = sampleOf(cnst.CommentInput);
  const updateComment = await userAgent.fetch.createComment({
    ...commentSample,
    rootType: "story",
    root: story.id,
    group: "user",
    type: "user",
    user: userAgent.user.id,
    name: "updatedName",
    content: "updatedContent",
  });
  return updateComment;
};

export const removeComment = async (agent: AdminAgent | UserAgent, commentId: string): Promise<cnst.Comment> => {
  const removedComment = await agent.fetch.removeComment(commentId);
  return removedComment;
};

export const replyComment = async (userAgent: UserAgent, parentComment: cnst.Comment): Promise<cnst.Comment> => {
  const commentSample = sampleOf(cnst.CommentInput);
  const reply = await userAgent.fetch.createComment({
    ...commentSample,
    rootType: "comment",
    root: parentComment.id,
    group: "user",
    type: "user",
    user: userAgent.user.id,
  });
  return reply;
};
