"use client";
import { AiOutlineComment, AiOutlineDislike, AiOutlineLike, AiOutlineRedo } from "react-icons/ai";
import { ClientInit, DefaultOf, FetchInitForm, Self } from "@core/base";
import { Comment, cnst, st, usePage } from "@social/client";
import { Data, Load } from "@shared/ui";
import { Empty, Layout, Loading, Pagination } from "@util/ui";
import { ModelsProps } from "@core/client";
import { useEffect } from "react";

export const Admin = ({ sliceName = "comment", init, query }: ModelsProps<cnst.Comment>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Comment.Unit.Card}
      renderDashboard={Comment.Util.Stat}
      renderInsight={Comment.Util.Insight}
      // renderTemplate={Comment.Template.General}
      renderTitle={(comment: DefaultOf<cnst.Comment>) => comment.content}
      renderView={(comment: cnst.Comment) => <Comment.View.General comment={comment} />}
      type="list"
      columns={[
        "content",
        {
          key: "totalStat",
          render: (totalStat: cnst.StoryStat) => (
            <div className="flex items-center gap-1">
              <span className="flex items-center gap-1">
                <AiOutlineLike /> {totalStat.likes}
              </span>
              <span className="flex items-center gap-1">
                <AiOutlineDislike /> {totalStat.unlikes}
              </span>
            </div>
          ),
        },
        "rootType",
        { key: "user", render: (user: cnst.shared.LightUser) => user.nickname },
        "createdAt",
        "status",
      ]}
      actions={(comment: cnst.LightComment, idx: number) => [
        "remove",
        ...(comment.status === "active"
          ? [
              { type: "approve", render: () => <Comment.Util.Approve id={comment.id} /> },
              { type: "deny", render: () => <Comment.Util.Deny id={comment.id} /> },
            ]
          : comment.status === "approved"
            ? [{ type: "deny", render: () => <Comment.Util.Deny id={comment.id} /> }]
            : comment.status === "denied"
              ? [{ type: "approve", render: () => <Comment.Util.Approve id={comment.id} /> }]
              : []),
      ]}
    />
  );
};

const storeUse = st.use as { [key: string]: <T>() => T };

interface CommentZoneInClientProps {
  rootId: string;
  rootType: string;
  self?: cnst.User;
  query?: Record<string, any>;
  init?: false | FetchInitForm<cnst.CommentInput, cnst.Comment, cnst.CommentFilter>;
  disableNewComment?: boolean;
  showRefresh?: boolean;
  signinHref?: string;
}
export const InClient = ({
  rootId,
  rootType,
  self = storeUse.self<cnst.User>(),
  showRefresh,
  disableNewComment,
  query = {},
  init = {},
  signinHref = "/signin",
}: CommentZoneInClientProps) => {
  const { l } = usePage();
  const commentForm = st.use.commentForm();
  const commentMap = st.use.commentMap();
  const commentInsight = st.use.commentInsight();
  const commentMapLoading = st.use.commentMapLoading();
  const pageOfComment = st.use.pageOfComment();
  const limitOfComment = st.use.limitOfComment();
  const commentModal = st.use.commentModal();
  useEffect(() => {
    setTimeout(() => {
      //! 추후 수정필요. 현재 너무 빨리 쿼리하면 토큰값이 안날아가서 like값이 0으로 옴
      if (init !== false)
        void st.do.initComment(
          { root: rootId, ...query },
          {
            ...init,
            default: {
              root: rootId,
              rootType,
              type: self.roles.includes("admin") ? "admin" : "user",
              user: self,
              ...(init.default ?? {}),
            },
            sort: "parentLatest",
          }
        );
    }, 500);
  }, [rootId, self]);
  return (
    <div className="mt-6">
      <h3 className="-mb-1 mt-5 flex items-center gap-1 pb-2 text-lg font-bold">
        <AiOutlineComment /> {l("comment.modelName")} ({commentInsight.count})
        {showRefresh ? (
          <button
            className="btn btn-outline btn-square btn-sm relative ml-2"
            onClick={() => st.do.refreshComment({ invalidate: true })}
          >
            <AiOutlineRedo />
          </button>
        ) : null}
      </h3>
      <div>
        {!commentForm.id.length && !commentForm.parent && !disableNewComment && (
          <Comment.Template.New self={self} signinHref={signinHref} />
        )}
        {commentMapLoading ? (
          <div className="flex gap-3 py-2">
            <Loading.Button active style={{ width: "60px", height: "60px", borderRadius: "100%" }} />
            <Loading />
          </div>
        ) : (
          [...commentMap.values()]
            .sort((a, b) => {
              const diff = a.parentCreatedAt.diff(b.parentCreatedAt);
              return diff === 0 ? a.createdAt.diff(b.createdAt) : diff;
            })
            .map((comment, idx) => (
              <div key={comment.id}>
                {["removed", "denied"].includes(comment.status) ? (
                  <Comment.Unit.Removed comment={comment} />
                ) : commentForm.id === comment.id ? (
                  <Comment.Template.General self={self} />
                ) : (
                  <Comment.Unit.Card showProfile={false} comment={comment} self={self} />
                )}
                {!commentForm.id.length && commentForm.parent === comment.id && (
                  <Comment.Template.NewCoco self={self} idx={idx} />
                )}
              </div>
            ))
        )}
      </div>
      <div className="mb-10 mt-6 flex w-full justify-center">
        <Pagination
          currentPage={pageOfComment}
          total={commentInsight.count}
          onPageSelect={(page) => void st.do.setPageOfComment(page)}
          itemsPerPage={limitOfComment || 20}
        />
      </div>
    </div>
  );
};

interface CommentZoneInRootProps {
  root: string;
  rootType: string;
  init: ClientInit<"comment", cnst.LightComment>;
  account?: Self;
  disableNewComment?: boolean;
  showRefresh?: boolean;
  signinHref?: string;
}
export const InRoot = ({
  root,
  rootType,
  account,
  showRefresh,
  disableNewComment,
  init,
  signinHref = "/signin",
}: CommentZoneInRootProps) => {
  const { l } = usePage();
  const self = storeUse.self<cnst.User>();
  const commentForm = st.use.commentForm();
  const commentInsight = st.use.commentInsight();
  useEffect(() => {
    st.do.setDefaultComment({
      ...st.get().defaultComment,
      root,
      rootType,
      type: self.roles.includes("admin") ? "admin" : "user",
      user: self,
    });
  }, [self]);
  return (
    <Layout.Zone className="mt-6">
      <h3 className="-mb-1 mt-5 flex items-center gap-1 pb-7 text-lg font-bold">
        <AiOutlineComment /> {l("comment.modelName")}({commentInsight.count})
        {showRefresh ? (
          <button
            className="btn btn-outline btn-square btn-sm relative ml-2"
            onClick={() => st.do.refreshComment({ invalidate: true })}
          >
            <AiOutlineRedo />
          </button>
        ) : null}
      </h3>
      <div>
        {!disableNewComment ? <Comment.Template.New self={self} signinHref={signinHref} /> : null}
        <Load.Units
          init={init}
          sort={(a, b) => {
            const diff = a.parentCreatedAt.diff(b.parentCreatedAt);
            return diff === 0 ? a.createdAt.diff(b.createdAt) : diff;
          }}
          renderItem={(comment, idx) => (
            <div className={idx > 0 ? "border-t-[0.5px] border-gray-300 " : ""} key={comment.id}>
              {["removed", "denied"].includes(comment.status) ? (
                <Comment.Unit.Removed comment={comment} />
              ) : commentForm.id === comment.id ? (
                <Comment.Template.General self={account} signinHref={signinHref} />
              ) : (
                <Comment.Unit.Card showProfile={false} comment={comment} self={account} />
              )}

              {!commentForm.id.length && commentForm.parent === comment.id && (
                <Comment.Template.NewCoco self={account} idx={idx} signinHref={signinHref} />
              )}
            </div>
          )}
          renderEmpty={() => <Empty />}
        />
      </div>
    </Layout.Zone>
  );
};
