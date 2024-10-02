import { type ModelDictionary, SignalDictionary, scalarDictionaryOf } from "@core/base";
import { SearchResult } from "./search.constant";
import type { SearchSignal } from "./search.signal";

const dictionary = {} as const;

const modelDictionary = {
  searchResult: scalarDictionaryOf(SearchResult, {
    modelName: ["SearchResult", "검색 결과"],
    modelDesc: ["SearchResult", "검색 결과"],
    // * ==================== Model ==================== * //
    // * ==================== Model ==================== * //
    docs: ["Documents", "문서"],
    "desc-docs": ["Documents", "문서"],

    skip: ["Skip", "건너뛰기"],
    "desc-skip": ["Skip", "건너뛰기"],

    limit: ["Limit", "제한"],
    "desc-limit": ["Limit", "제한"],

    sort: ["Sort", "정렬"],
    "desc-sort": ["Sort", "정렬"],

    total: ["Total", "전체"],
    "desc-total": ["Total", "전체"],
    // * ==================== Etc ==================== * //
    // * ==================== Etc ==================== * //
  } satisfies ModelDictionary<SearchResult>),
} as const;

const signalDictionary = {
  modelName: ["Search", "검색"],
  modelDesc: ["Search", "검색"],

  // * ==================== Endpoint ==================== * //
  "api-getSearchIndexNames": ["Get search index names", "검색 인덱스 이름 가져오기"],
  "apidesc-getSearchIndexNames": ["Get search index names", "검색 인덱스 이름 가져오기"],

  "api-getSearchResult": ["Get search result", "검색 결과 가져오기"],
  "apidesc-getSearchResult": ["Get search result", "검색 결과 가져오기"],
  "arg-getSearchResult-searchIndexName": ["Search index name", "검색 인덱스 이름"],
  "argdesc-getSearchResult-searchIndexName": ["Search index name", "검색 인덱스 이름"],
  "arg-getSearchResult-searchString": ["Search string", "검색 문자열"],
  "argdesc-getSearchResult-searchString": ["Search string", "검색 문자열"],
  "arg-getSearchResult-skip": ["Skip", "건너뛰기"],
  "argdesc-getSearchResult-skip": ["Skip", "건너뛰기"],
  "arg-getSearchResult-limit": ["Limit", "제한"],
  "argdesc-getSearchResult-limit": ["Limit", "제한"],
  "arg-getSearchResult-sort": ["Sort", "정렬"],
  "argdesc-getSearchResult-sort": ["Sort", "정렬"],

  "api-resyncSearchDocuments": ["Resync search documents", "검색 문서 동기화"],
  "apidesc-resyncSearchDocuments": ["Resync search documents", "검색 문서 동기화"],
  "arg-resyncSearchDocuments-searchIndexName": ["Search index name", "검색 인덱스 이름"],
  "argdesc-resyncSearchDocuments-searchIndexName": ["Search index name", "검색 인덱스 이름"],

  "api-dropSearchDocuments": ["Drop search documents", "검색 문서 삭제"],
  "apidesc-dropSearchDocuments": ["Drop search documents", "검색 문서 삭제"],
  "arg-dropSearchDocuments-searchIndexName": ["Search index name", "검색 인덱스 이름"],
  "argdesc-dropSearchDocuments-searchIndexName": ["Search index name", "검색 인덱스 이름"],
  // * ==================== Endpoint ==================== * //

  // * ==================== Etc ==================== * //
  "resyncSearchDocuments-loading": ["Resyncing search documents...", "검색 문서 동기화 중..."],
  "resyncSearchDocuments-success": ["Search documents resynced", "검색 문서 동기화 완료"],
  // * ==================== Etc ==================== * //
} satisfies SignalDictionary<SearchSignal>;

export const searchDictionary = { search: { ...dictionary, ...signalDictionary }, ...modelDictionary } as const;
