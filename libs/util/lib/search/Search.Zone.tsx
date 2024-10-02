"use client";

import { BiSearch } from "react-icons/bi";
import { Loading, Pagination, ToggleSelect } from "@util/ui";
import { Search, st, usePage } from "@util/client";
import { useDebounce } from "@core/next";
import { useEffect } from "react";

interface AdminProps {
  className?: string;
}

export const Admin = ({ className }: AdminProps) => {
  const { l } = usePage();
  const searchIndexName = st.use.searchIndexName();
  const searchDocumentsLoading = st.use.searchDocumentsLoading();
  const searchIndexNames = st.use.searchIndexNames();
  const searchResult = st.use.searchResult();
  const searchString = st.use.searchString();
  const pageOfSearchDocuments = st.use.pageOfSearchDocuments();
  const handleChangeSearchString = useDebounce(st.do.setSearchString, [], 500);
  useEffect(() => {
    void st.do.getSearchIndexNames();
  }, []);
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-xl">Model</div>
      <ToggleSelect
        value={searchIndexName}
        items={searchIndexNames}
        onChange={st.do.setSearchIndexName}
        nullable
        validate={() => true}
      />
      <div className="text-xl">Operations</div>
      <div className="flex gap-2">
        <button className="btn btn-outline" onClick={() => st.do.resyncSearchDocuments()} disabled={!searchIndexName}>
          {l("search.api-resyncSearchDocuments")}
        </button>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-xl">Documents</div>
        <label className="input input-bordered flex items-center gap-2">
          <input
            type="text"
            className="grow"
            placeholder="Search"
            defaultValue={searchString}
            onChange={(e) => handleChangeSearchString(e.target.value)}
          />
          <BiSearch />
        </label>
      </div>
      <div className="relative grid grid-cols-4 gap-2">
        {searchResult.docs.map((doc, i) => (
          <Search.Unit.Card key={i} doc={doc} />
        ))}
        {searchDocumentsLoading ? <Loading.Area /> : null}
      </div>
      <Pagination
        currentPage={pageOfSearchDocuments}
        itemsPerPage={searchResult.limit}
        total={searchResult.total}
        onPageSelect={(page) => st.do.setPageOfSearchDocuments(page)}
      />
    </div>
  );
};
