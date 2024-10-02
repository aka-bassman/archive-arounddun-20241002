import * as userSpec from "@social/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sample, sampleOf } from "@core/common";

export const createChatRoom = async (userAgent1: userSpec.UserAgent, userAgent2: userSpec.UserAgent) => {
  const users = [userAgent1.user.id, userAgent2.user.id];
  const chatRoom = await userAgent1.fetch.createChatRoom({ rootType: "chatRoom", users });
  return chatRoom;
};

export const addTextChat = async (userAgent: userSpec.UserAgent, chatRoom: cnst.LightChatRoom) => {
  const chat = { ...sampleOf(cnst.Chat), user: userAgent.user.id, text: sample.sentence() };
  await userAgent.fetch.addChat(chatRoom.id, chat);
  return chat;
};
