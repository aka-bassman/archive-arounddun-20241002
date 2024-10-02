import * as sig from "./sig";
import { localFileDictionary } from "./localFile/localFile.dictionary";
import { makeDictionary, makeTrans, rootDictionary, signalDictionaryOf } from "@core/base";
import { searchDictionary } from "./search/search.dictionary";
import { securityDictionary } from "./security/security.dictionary";
import { utilDictionary } from "./_util/util.dictionary";

export const dictionary = makeDictionary(rootDictionary, {
  ...utilDictionary,
  // * ==================== Scalar Models ==================== * //
  // * ==================== Scalar Models ==================== * //

  // * ==================== Service Models ==================== * //
  localFile: signalDictionaryOf(sig.LocalFileSignal, localFileDictionary),
  security: signalDictionaryOf(sig.SecuritySignal, securityDictionary),
  ...searchDictionary,
  // * ==================== Service Models ==================== * //
} as const);
export const { Revert, translate, msg } = makeTrans(dictionary);
