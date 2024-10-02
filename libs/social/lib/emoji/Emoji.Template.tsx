"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@social/client";

interface EmojiEditProps {
  emojiId?: string | null;
}

export const General = ({ emojiId = undefined }: EmojiEditProps) => {
  const emojiForm = st.use.emojiForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("emoji", "name")}
        desc={l.desc("emoji", "name")}
        value={emojiForm.name}
        onChange={st.do.setNameOnEmoji}
      />
      <Field.Img
        label={l.field("emoji", "file")}
        desc={l.desc("emoji", "file")}
        sliceName="emoji"
        value={emojiForm.file}
        onChange={st.do.setFileOnEmoji}
      />
    </Layout.Template>
  );
};
