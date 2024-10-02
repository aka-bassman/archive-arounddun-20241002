"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@shared/client";

interface FileEditProps {
  fileId?: string | null;
}
export const General = ({ fileId = undefined }: FileEditProps) => {
  const fileForm = st.use.fileForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("file", "filename")}
        desc={l.desc("file", "filename")}
        value={fileForm.url}
        onChange={st.do.setUrlOnFile}
      />
    </Layout.Template>
  );
};
