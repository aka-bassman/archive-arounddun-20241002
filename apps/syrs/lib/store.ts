"use client";
import { ImageHostingStore } from "./imageHosting/imageHosting.store";
import { MixStore, rootStoreOf } from "@core/client";
import { PromptStore } from "./prompt/prompt.store";
import { ResultStore } from "./result/result.store";
import { SettingStore } from "./setting/setting.store";
import { SummaryStore } from "./summary/summary.store";
import { SyrsStore } from "./_syrs/syrs.store";
import { TestStore } from "./test/test.store";
import { UserStore } from "./user/user.store";
import { store as shared } from "@shared/client";
import { store as social } from "@social/client";

export class RootStore extends MixStore(
  shared,
  social,
  SyrsStore,
  UserStore,
  SettingStore,
  SummaryStore,
  TestStore,
  ResultStore,
  PromptStore
,
ImageHostingStore) {}
export const store = rootStoreOf(RootStore);
