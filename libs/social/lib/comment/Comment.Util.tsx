"use client";
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineComment,
  AiOutlineDelete,
  AiOutlineDislike,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMore,
  AiOutlineNumber,
  AiOutlineWarning,
} from "react-icons/ai";
import { Data, Model } from "@shared/ui";
import { Dropdown, Modal } from "@util/ui";
import { ModelDashboardProps, ModelInsightProps } from "@core/client";
import { Report, cnst, st, usePage } from "@social/client";
import { Self, getQueryMap } from "@core/base";

export const Stat = ({
  className,
  summary,
  sliceName = "comment",
  queryMap = getQueryMap(cnst.CommentSummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalComment", "activeComment", "approvedComment", "deniedComment"]}
      presents={["haComment", "daComment", "waComment", "maComment"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "comment" }: ModelInsightProps<cnst.CommentInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ApproveProps {
  id: string;
}
export const Approve = ({ id }: ApproveProps) => {
  return (
    <button className="btn btn-sm btn-success gap-2" onClick={() => st.do.approveComment(id)}>
      <AiOutlineNumber />
      Approve
    </button>
  );
};

interface DenyProps {
  id: string;
}
export const Deny = ({ id }: DenyProps) => {
  return (
    <button className="btn btn-sm btn-warning btn-outline gap-2 border-dashed" onClick={() => st.do.denyComment(id)}>
      <AiOutlineNumber />
      Deny
    </button>
  );
};

interface LikeProps {
  id: string;
  like: number;
  totalLike: number;
}
export const Like = ({ id, like, totalLike }: LikeProps) => {
  return (
    <>
      <button
        className="btn btn-ghost text-primary mr-2 w-auto"
        onClick={() => {
          like <= 0 ? st.do.likeComment(id) : st.do.resetLikeComment(id);
        }}
      >
        {like > 0 ? <AiFillLike /> : <AiOutlineLike />}
        <span className={` w-4 text-xs ${totalLike > 0 ? "visible" : "invisible"}`}>{totalLike}</span>
      </button>
      <button
        className="btn btn-ghost text-primary w-auto"
        onClick={() => {
          like >= 0 ? st.do.unlikeComment(id) : st.do.resetLikeComment(id);
        }}
      >
        {like < 0 ? <AiFillDislike /> : <AiOutlineDislike />}
      </button>
    </>
  );
};

interface ToolMenuProps {
  id: string;
  userId: string;
  self?: Self | cnst.User;
}
export const ToolMenu = ({ id, userId, self }: ToolMenuProps) => {
  const { l } = usePage();
  const commentModal = st.use.commentModal();
  const storeGet = st.get as unknown as <T>() => { [key: string]: T };
  return (
    <>
      <Dropdown
        className=""
        value={<AiOutlineMore />}
        buttonClassName="btn w-auto btn-ghost"
        content={
          self?.id === userId ? (
            <div className="flex flex-col gap-1">
              <button
                className="btn btn-sm btn-ghost flex w-auto flex-nowrap gap-1"
                onClick={() => st.do.editComment(id)}
              >
                <AiOutlineEdit />
                {l("social.edit")}
              </button>
              <button
                className="btn btn-sm btn-ghost flex flex-nowrap gap-1 text-red-500"
                onClick={() => {
                  st.do.setCommentModal("remove");
                }}
              >
                <AiOutlineDelete />
                {l("social.remove")}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-ghost  flex w-auto flex-nowrap gap-1 text-red-500"
              onClick={() => {
                const { commentMap, commentMapLoading } = st.get();
                const self = storeGet<cnst.User>().self;
                if (commentMapLoading || !self.id) return;
                const comment = commentMap.get(id);
                if (!comment) return;
                st.do.newReport(
                  {
                    type: "comment",
                    target: comment.id,
                    targetUser: comment.user,
                    from: self,
                    title: `Report-${comment.user.nickname}-Comment`,
                  },
                  { modal: `report-${id}` }
                );
              }}
            >
              <AiOutlineWarning className="mr-1" />
              {l("social.report")}
            </button>
          )
        }
      />
      <Modal
        title="Remove Comment"
        open={commentModal === "remove"}
        onCancel={() => {
          st.do.setCommentModal("");
        }}
        action={
          <button className="btn btn-sm btn-error" onClick={() => st.do.removeComment(id)}>
            Remove
          </button>
        }
      >
        {l("social.removeMsg")}
      </Modal>
      <Model.EditModal
        modal={`report-${id}`}
        renderTitle={() => l("comment.reportComment")}
        sliceName="report"
        onSubmit={() => {
          window.alert(l("comment.reportCommentSuccess"));
        }}
      >
        <Report.Template.Content />
      </Model.EditModal>
    </>
  );
};

interface NewCocoProps {
  className?: string;
  commentId: string;
  meta: Record<string, any> | null;
}
export const NewCoco = ({ className, commentId, meta }: NewCocoProps) => {
  const { l } = usePage();
  const commentForm = st.use.commentForm();
  if (commentForm.parent === commentId) return null;
  return (
    <button
      className="btn btn-ghost w-auto gap-2"
      onClick={() => {
        st.do.newComment({ parent: commentId, parentType: "comment", meta });
      }}
    >
      <AiOutlineComment />
      {l("social.reply")}
    </button>
  );
};
