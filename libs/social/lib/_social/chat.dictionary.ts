import { ModelDictionary, SignalDictionary } from "@core/base";
import type { Chat } from "./chat.constant";
import type { ChatSignal } from "./chat.signal";

const modelDictionary = {
  modelName: ["Chat", "채팅"],
  modelDesc: ["Chat", "채팅"],

  // * ==================== Model ==================== * //
  user: ["User", "사용자"],
  "desc-user": ["User", "사용자"],

  type: ["Type", "타입"],
  "desc-type": ["Type", "타입"],

  images: ["Images", "이미지"],
  "desc-images": ["Images", "이미지"],

  emoji: ["Emoji", "이모지"],
  "desc-emoji": ["Emoji", "이모지"],

  text: ["Text", "텍스트"],
  "desc-text": ["Text", "텍스트"],

  at: ["At", "시간"],
  "desc-at": ["At", "시간"],
  // * ==================== Model ==================== * //

  // * ==================== Etc ==================== * //
  "enum-type-text": ["Text", "텍스트"],
  "enumdesc-type-text": ["Text type", "텍스트 타입"],
  "enum-type-image": ["Image", "이미지"],
  "enumdesc-type-image": ["Image type", "이미지 타입"],
  "enum-type-notice": ["Notice", "공지"],
  "enumdesc-type-notice": ["Notice type", "공지 타입"],
  // * ==================== Etc ==================== * //
} satisfies ModelDictionary<Chat>;

const signalDictionary = {
  // * ==================== Endpoint ==================== * //
  // * ==================== Endpoint ==================== * //
} satisfies SignalDictionary<ChatSignal>;

export const chatDictionary = { ...modelDictionary, ...signalDictionary };
