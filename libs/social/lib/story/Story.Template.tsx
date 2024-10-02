"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { cnst } from "../cnst";
import { st, usePage } from "@social/client";
import { useState } from "react";

interface StoryEditProps {
  type?: cnst.BoardViewStyle;
  categories?: string[];
  storyId?: string | null;
  self?: cnst.LightUser;
}

export const General = ({ type, categories = [], self, storyId = null }: StoryEditProps) => {
  const storyForm = st.use.storyForm();

  const { l } = usePage();
  return (
    <Layout.Template>
      {self?.roles.includes("admin") && (
        <Field.ToggleSelect
          label={l("story.type")}
          items={["user", "admin"]}
          value={storyForm.type}
          onChange={(type) => {
            st.do.setTypeOnStory(type);
          }}
        />
      )}
      {categories.length ? (
        <Field.ToggleSelect
          label={l("story.category")}
          items={categories}
          value={storyForm.category}
          onChange={st.do.setCategoryOnStory}
        />
      ) : null}
      {type === "youtube" ? (
        <div className="flex items-center gap-4">
          <Field.Img label={l("story.logo")} sliceName="story" value={storyForm.logo} onChange={st.do.setLogoOnStory} />
          <Field.Imgs
            label={l("story.thumbnails")}
            sliceName="story"
            value={storyForm.thumbnails}
            onChange={st.do.setThumbnailsOnStory}
          />
        </div>
      ) : null}
      <Field.Text label={l("story.title")} value={storyForm.title} onChange={st.do.setTitleOnStory} />
      <Field.Slate
        label={l("story.content")}
        sliceName="story"
        disabled={storyId !== storyForm.id}
        addFile={st.do.addImagesOnStory}
        onChange={st.do.setContentOnStory}
        value={storyForm.id && storyForm.content}
      />
    </Layout.Template>
  );
};
export const Admin = () => {
  const storyForm = st.use.storyForm();
  const [board, setBoard] = useState<cnst.LightBoard | null>(null);
  const { l } = usePage();
  if (storyForm.id) return <General />;
  return (
    <Layout.Template>
      <Field.ParentId
        label={l.field("story", "board")}
        desc={l.desc("story", "board")}
        initArgs={[{ status: "active" }]}
        onChange={(boardId: string, board: cnst.LightBoard) => {
          st.do.setStoryForm({ ...storyForm, root: boardId, rootType: "board", type: "user" });
          setBoard(board);
        }}
        value={storyForm.root}
        sliceName="board"
        renderOption={(board: cnst.LightBoard) => board.name}
      />
      {board ? (
        <>
          <Field.Parent
            label={l.field("story", "user")}
            desc={l.desc("story", "user")}
            initArgs={[{ roles: { $in: board.roles } }]}
            onChange={(user: cnst.LightUser) => {
              st.do.setUserOnStory(user);
            }}
            value={storyForm.user}
            sliceName="user"
            renderOption={(user: cnst.LightUser) => user.nickname}
          />
          {storyForm.user ? (
            <General type={board.viewStyle} categories={board.categories} self={storyForm.user} />
          ) : null}
        </>
      ) : null}
    </Layout.Template>
  );
};
