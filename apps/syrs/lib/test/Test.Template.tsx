"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@syrs/client";

interface TestEditProps {
  testId?: string | null;
}

export const General = ({ testId = undefined }: TestEditProps) => {
  const testForm = st.use.testForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("test", "id")}
        desc={l.desc("test", "id")}
        value={testForm.id}
        onChange={st.do.setIdOnTest}
      />
    </Layout.Template>
  );
};
