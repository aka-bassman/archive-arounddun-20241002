"use client";
import {
  AiOutlineCheckCircle,
  AiOutlineCloseCircle,
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineMore,
  AiOutlineSearch,
  AiOutlineWarning,
} from "react-icons/ai";
import { Data, Model } from "@shared/ui";
import { Dropdown, Link, Modal } from "@util/ui";
import { Like } from "@social/ui";
import { ModelDashboardProps, ModelInsightProps, clsx, router } from "@core/client";
import { Report, cnst, st, usePage } from "@social/client";
import { getQueryMap } from "@core/base";
import { useCallback, useEffect, useState } from "react";

export const Stat = ({
  className,
  summary,
  sliceName = "story",
  queryMap = getQueryMap(cnst.StorySummary),
  hidePresents,
}: ModelDashboardProps<cnst.Summary>) => {
  return (
    <Data.Dashboard
      summary={summary}
      sliceName={sliceName}
      queryMap={queryMap}
      columns={["totalStory", "activeStory", "approvedStory", "deniedStory"]}
      presents={["haStory", "daStory", "waStory", "maStory"]}
      hidePresents={hidePresents}
    />
  );
};
export const Insight = ({ className, insight, sliceName = "story" }: ModelInsightProps<cnst.StoryInsight>) => {
  return <Data.Insight className={className} insight={insight} sliceName={sliceName} columns={["count"]} />;
};

interface ApproveProps {
  id: string;
}
export const Approve = ({ id }: ApproveProps) => {
  return (
    <button className="btn btn-primary btn-sm gap-2" onClick={() => st.do.approveStory(id)}>
      <AiOutlineCheckCircle />
      Approve
    </button>
  );
};

interface DenyProps {
  id: string;
}
export const Deny = ({ id }: DenyProps) => {
  return (
    <button className="btn btn-warning btn-outline btn-sm border-dashed" onClick={() => st.do.denyStory(id)}>
      <AiOutlineCloseCircle />
      Deny
    </button>
  );
};

interface LikeDislikeProps {
  id: string;
  like: number;
  totalLike: number;
}
export const LikeDislike = ({ id, like, totalLike }: LikeDislikeProps) => {
  return (
    <Like.WithDislike
      like={like}
      totalLike={totalLike}
      onLike={() => {
        st.do.likeStory(id);
      }}
      onResetlike={() => {
        st.do.resetLikeStory(id);
      }}
      onDislike={() => {
        st.do.unlikeStory(id);
      }}
    />
  );
};

interface CategoryProps {
  categories: string[];
}
export const Category = ({ categories }: CategoryProps) => {
  const [queryOfStory] = st.use.queryArgsOfStory();
  return (
    <>
      {categories.length ? (
        <button
          className={`cursor-pointer whitespace-nowrap border border-white/50 px-2 py-1 text-sm ${
            !queryOfStory.category && "text-primary bg-white"
          }`}
          onClick={() => st.do.setQueryArgsOfStory({ ...queryOfStory, category: undefined })}
        >
          All
        </button>
      ) : null}
      {categories.map((category) => (
        <button
          key={category}
          className={`cursor-pointer whitespace-nowrap border border-white/50 px-2 py-1  text-sm ${
            queryOfStory.category === category && "text-primary bg-white"
          }`}
          onClick={() => st.do.setQueryArgsOfStory({ ...queryOfStory, category })}
        >
          {category}
        </button>
      ))}
    </>
  );
};
interface WriteProps {
  root: string;
  rootType: string;
  canWrite?: boolean;
  writeButtonProps?: Partial<React.ButtonHTMLAttributes<HTMLButtonElement>>;
}
export const Write = ({ root, rootType, canWrite = true, writeButtonProps = {} }: WriteProps) => {
  const { l } = usePage();
  return (
    <>
      {/* <button
        className="relative mx-4 btn btn-outline btn-square"
        onClick={() => st.do.refreshStory({ invalidate: true })}
      >
        <AiOutlineRedo />
      </button> */}
      <button
        className="btn btn-secondary gap-2"
        {...writeButtonProps}
        onClick={() => (canWrite ? router.push(`/${rootType}/${root}/story/new`) : router.push("/signin"))}
      >
        <AiOutlineEdit />
        {l("story.write")}
      </button>
    </>
  );
};

export const ToolMenu = ({
  id,
  isMe,
  root,
  rootType,
}: {
  id: string;
  isMe?: boolean;
  root: string;
  rootType: string;
}) => {
  const storyModal = st.use.storyModal();
  const reportModal = st.use.reportModal();
  const { l } = usePage();
  return (
    <>
      <Dropdown
        value={<AiOutlineMore />}
        buttonClassName="btn btn-ghost"
        content={
          isMe ? (
            <div className="flex w-full flex-col gap-1">
              <Link href={`/${rootType}/${root}/story/${id}/edit`}>
                <button className="btn btn-sm btn-ghost flex w-full flex-nowrap gap-1">
                  <AiOutlineEdit />
                  {l("social.edit")}
                </button>
              </Link>
              <button
                className="btn btn-sm btn-ghost flex flex-nowrap gap-1 text-red-500"
                onClick={() => {
                  st.do.setStoryModal("remove");
                }}
              >
                <AiOutlineDelete />
                {l("social.remove")}
              </button>
            </div>
          ) : (
            <button
              className="btn btn-sm btn-ghost flex w-full flex-nowrap gap-1 text-red-500"
              onClick={() => {
                const { story, self } = st.get() as unknown as { story: cnst.Story | null; self: cnst.User };
                if (!story || !self.id) return;
                st.do.newReport(
                  {
                    type: "story",
                    target: story.id,
                    targetUser: story.user,
                    from: self,
                    title: `Report-${story.title}`,
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
        title={l("story.removeStory")}
        open={storyModal === "remove"}
        onCancel={() => {
          st.do.setStoryModal("view");
        }}
        action={
          <button
            className="btn btn-sm btn-error"
            onClick={async () => {
              await st.do.removeStory(id);
              router.push(`/${rootType}/${root}`); // : router.back();
            }}
          >
            Remove
          </button>
        }
      >
        {l("story.removeStoryConfirm")}
      </Modal>
      <Model.EditModal
        modal={`report-${id}`}
        renderTitle={() => `신고하기`}
        sliceName="report"
        onSubmit={() => {
          window.alert(l("story.reportStorySuccess"));
        }}
      >
        <Report.Template.Content />
      </Model.EditModal>
    </>
  );
};

interface SearchProps {
  className?: string;
}

export const Search = ({ className }: SearchProps) => {
  const { l } = usePage();
  const [search, setSearch] = useState("");
  const [root, title, statuses] = st.use.queryArgsOfStoryInRoot();

  const searchModel = useCallback(() => st.do.setQueryArgsOfStoryInRoot(root, search, statuses), [search]);
  return (
    <div className="flex w-full gap-2">
      <input
        onKeyPress={(e) => e.key === "Enter" && searchModel()}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="input input-sm label border-primary text-primary  placeholder:text-primary/40 w-full  rounded-md border py-6 outline-none focus:outline-none"
        placeholder="제목을 검색해보세요"
      />
      <button onClick={() => searchModel()} className="btn-primary btn w-auto">
        <AiOutlineSearch className="text-lg" />
      </button>
    </div>
  );
};

interface CreateProps {
  className?: string;
}

export const Create = ({ className }: CreateProps) => {
  const { l } = usePage();
  const submitable = st.use.storySubmit();
  const storyForm = st.use.storyForm();
  useEffect(() => {
    void st.do.checkStorySubmitable();
  }, [storyForm]);
  return (
    <div className={clsx("flex w-full justify-center", className)}>
      <button
        className="btn btn-primary text-primary-content w-full"
        onClick={() => {
          void st.do.createStoryInForm();
          router.back();
        }}
        disabled={submitable.disabled || storyForm.content.length < 12}
      >
        <AiOutlineEdit />
        작성 완료
      </button>
    </div>
  );
};
