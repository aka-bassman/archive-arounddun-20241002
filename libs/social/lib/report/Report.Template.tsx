"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@social/client";

interface ReportEditProps {
  reportId?: string | null;
}

export const General = ({ reportId = null }: ReportEditProps) => {
  const reportForm = st.use.reportForm();
  const { l } = usePage();

  return (
    <Layout.Template>
      <Field.Text
        label={l.field("report", "title")}
        desc={l.desc("report", "title")}
        value={reportForm.title}
        onChange={st.do.setTitleOnReport}
      />
      <Field.Slate
        label={l.field("report", "content")}
        desc={l.desc("report", "content")}
        sliceName="report"
        disabled={reportId !== reportForm.id}
        value={reportForm.content}
        addFile={st.do.addFilesOnReport}
        onChange={st.do.setContentOnReport}
      />
    </Layout.Template>
  );
};

export const Content = () => {
  const reportForm = st.use.reportForm();
  const { l } = usePage();

  return (
    <Layout.Template>
      <Field.TextArea
        label={l.field("report", "content")}
        desc={l.desc("report", "content")}
        value={reportForm.content}
        onChange={st.do.setContentOnReport}
      />
    </Layout.Template>
  );
};
