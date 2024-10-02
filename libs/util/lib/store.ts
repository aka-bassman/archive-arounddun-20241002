"use client";
import { MixStore, rootStoreOf } from "@core/client";
import { SearchStore } from "./search/search.store";
import { UtilStore } from "./_util/util.store";

export class RootStore extends MixStore(UtilStore, SearchStore) {}
export const store = rootStoreOf(RootStore);
