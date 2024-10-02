"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@syrs/client";

interface ResultEditProps {
  resultId?: string | null;
}

export const General = ({ resultId = undefined }: ResultEditProps) => {
  const resultForm = st.use.resultForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("result", "id")}
        desc={l.desc("result", "id")}
        value={resultForm.id}
        onChange={st.do.setIdOnResult}
      />
    </Layout.Template>
  );
};
