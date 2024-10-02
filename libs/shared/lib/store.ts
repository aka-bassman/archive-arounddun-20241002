"use client";
import { AdminStore } from "./admin/admin.store";
import { BannerStore } from "./banner/banner.store";
import { FileStore } from "./file/file.store";
import { KeyringStore } from "./keyring/keyring.store";
import { MixStore, rootStoreOf } from "@core/client";
import { NotificationStore } from "./notification/notification.store";
import { SharedStore } from "./_shared/shared.store";
import { store as util } from "@util/client";

export class RootStore extends MixStore(
  util,
  AdminStore,
  KeyringStore,
  SharedStore,
  NotificationStore,
  FileStore,
  BannerStore
) {}
export const store = rootStoreOf(RootStore);
