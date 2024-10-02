"use client";
import { AiOutlineClose, AiOutlineSave, AiOutlineSend } from "react-icons/ai";
import { Avatar, Input } from "@util/ui";
import { Profile } from "@social/ui";
import { ReactNode } from "react";
import { Self } from "@core/base";
import { cnst } from "../cnst";
import { router } from "@core/client";
import { st, usePage } from "@social/client";

interface CommentEditProps {
  self?: Self | cnst.User;
  emptyProfile?: ReactNode;
  signinHref?: string;
}

export const General = ({ self, signinHref = "/signin" }: CommentEditProps) => {
  const commentForm = st.use.commentForm();
  const { l } = usePage();
  return (
    <div className={`${commentForm.parent ? "pl-8" : ""} bg-gray-50`}>
      <div className="flex w-full justify-end">
        <button
          className="flex size-10 items-center justify-center text-gray-400 "
          onClick={() => {
            st.do.resetComment();
          }}
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className={`flex flex-row justify-between gap-1`}>
        <div className="flex w-full items-start py-2">
          <div className="mr-2">
            {self?.image ? (
              <Avatar src={self.image.url} />
            ) : (
              <Profile.Empty
              // className={commentForm.parent ? "w-8 h-8 text-xl" : ""}
              />
            )}
          </div>
          <div className="flex w-full flex-col">
            <div className="mb-1 text-sm font-medium">
              <div className="flex items-center justify-between gap-3">
                <Input
                  className="w-full border-none"
                  inputClassName="w-full  outline-none border-gray-300 border"
                  value={commentForm.content}
                  onChange={(value) => {
                    if (self?.id) {
                      st.do.setContentOnComment(value);
                      return;
                    }
                    window.alert("로그인이 필요합니다.");
                    router.push(signinHref);
                  }}
                  onPressEnter={(_, e) => e.ctrlKey && st.do.createCommentInForm()}
                  placeholder={l("social.placeHolderComment")}
                  validate={(value) => true}
                />
                <button
                  className="btn btn-outline flex text-center text-xs text-gray-500"
                  onClick={() => st.do.updateCommentInForm()}
                >
                  <AiOutlineSave />
                  {l("social.save")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommentEditNewProps {
  self: Self | cnst.User | null;
  emptyProfile?: ReactNode;
  hideSubmit?: boolean;
  signinHref?: string;
}
export const New = ({
  self,
  emptyProfile = <Profile.Empty />,
  hideSubmit,
  signinHref = "/signin",
}: CommentEditNewProps) => {
  const commentForm = st.use.commentForm();
  const { l } = usePage();
  return (
    <div className={`flex w-full items-center gap-1 `}>
      <div className="mr-2">{self?.image ? <Avatar src={self.image.url} /> : emptyProfile}</div>
      <Input
        className="w-full border-none"
        inputClassName="w-full  outline-none  border-gray-300 border"
        value={commentForm.id || commentForm.parent ? "" : commentForm.content}
        // autoSize={{ maxRows: 10 }}
        onFocus={(e) => {
          if (self?.id) {
            st.do.newComment();
            return;
          }
          const confirm = window.confirm("로그인이 필요합니다.\n로그인 페이지로 이동할까요?");
          confirm ? router.push(signinHref) : e.target.blur();
        }}
        onChange={(value) => {
          if (self?.id) {
            st.do.setContentOnComment(value);
            return;
          }
          window.alert("로그인이 필요합니다.");
          router.push(signinHref);
        }}
        onPressEnter={(_, e) => {
          if (!commentForm.parent && commentForm.content.length > 1) void st.do.createCommentInForm();
        }}
        placeholder={l("social.placeHolderComment")}
        validate={(value) => true}
      />

      {hideSubmit ? undefined : (
        <button
          disabled={!!(commentForm.content.length < 1)}
          className="btn w-auto text-xs text-gray-500"
          onClick={() => st.do.createCommentInForm()}
        >
          <AiOutlineSend />
          {/* {l("social.comment")} */}
        </button>
      )}
    </div>
  );
};

interface CommentEditNewCocoProps {
  self?: Self | cnst.User;
  emptyProfile?: ReactNode;
  idx: number;
  signinHref?: string;
}
export const NewCoco = ({
  self,
  idx,
  emptyProfile = <Profile.Empty />,
  signinHref = "/signin",
}: CommentEditNewCocoProps) => {
  const { l } = usePage();
  const commentForm = st.use.commentForm();
  return (
    <div className={` gap-1 border-t border-gray-300 pb-3 pl-8`}>
      <div className="flex w-full justify-end">
        <button
          className="flex size-10 items-center justify-center text-gray-400 "
          onClick={() => {
            st.do.resetComment();
          }}
        >
          <AiOutlineClose />
        </button>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex w-full items-center">
          <div className="mr-2">{self?.image ? <Avatar src={self.image.url} /> : emptyProfile}</div>
          <div className="flex w-full flex-col">
            <div className="mb-1 text-sm font-medium">
              {/* <div className="border-b border-gray-300 "> */}
              <div className="flex items-center justify-between gap-5">
                <Input
                  className="w-full border-none"
                  inputClassName="w-full  outline-none     border-gray-300 "
                  // autoSize={{ maxRows: 10 }}
                  // value={commentForm.parent ? commentForm.content : ""}
                  value={commentForm.parent ? commentForm.content : ""}
                  onChange={(value) => {
                    if (self?.id) {
                      st.do.setContentOnComment(value);
                      return;
                    }
                    window.alert("로그인이 필요합니다.");
                    router.push(signinHref);
                  }}
                  onPressEnter={(_, e) =>
                    commentForm.parent && commentForm.content.length > 1 && st.do.createCommentInForm({ idx: idx + 1 })
                  }
                  placeholder={l("social.placeHolderComment")}
                  validate={(value) => true}
                />
                <button
                  className="btn btn-outline flex text-xs text-gray-500"
                  onClick={() => st.do.createCommentInForm({ idx: idx + 1 })}
                >
                  <AiOutlineSend /> {l("social.comment")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
