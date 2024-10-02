"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { cnst } from "../cnst";
import { st, usePage } from "@social/client";

interface BoardEditProps {
  boardId?: string | null;
}

export const General = ({ boardId = undefined }: BoardEditProps) => {
  const boardForm = st.use.boardForm();
  const { l } = usePage();

  return (
    <Layout.Template>
      <Field.Text
        label={l.field("board", "name")}
        desc={l.desc("board", "name")}
        value={boardForm.name}
        onChange={st.do.setNameOnBoard}
      />
      <Field.TextArea
        label={l.field("board", "description")}
        desc={l.desc("board", "description")}
        value={boardForm.description}
        onChange={st.do.setDescriptionOnBoard}
      />
      <Field.Tags
        label={l.field("board", "categories")}
        desc={l.desc("board", "categories")}
        value={boardForm.categories}
        onChange={st.do.setCategoriesOnBoard}
      />
      <Field.ToggleSelect
        label={l.field("board", "viewStyle")}
        desc={l.desc("board", "viewStyle")}
        items={cnst.boardViewStyles}
        value={boardForm.viewStyle}
        onChange={(viewStyle) => {
          st.do.setViewStyleOnBoard(viewStyle);
        }}
      />
      <Field.MultiToggleSelect
        label={l.field("board", "policy")}
        desc={l.desc("board", "policy")}
        items={cnst.boardPolicies}
        value={boardForm.policy}
        onChange={st.do.setPolicyOnBoard}
      />
      <Field.MultiToggleSelect
        label={l.field("board", "roles")}
        desc={l.desc("board", "roles")}
        items={cnst.shared.userRoles}
        value={boardForm.roles}
        onChange={st.do.setRolesOnBoard}
      />
    </Layout.Template>
  );
};
