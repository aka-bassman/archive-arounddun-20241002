"use client";
import { Layout } from "@util/ui";
import { st, usePage } from "@social/client";

interface ActionLogEditProps {
  actionLogId?: string | null;
}

export const General = ({ actionLogId = undefined }: ActionLogEditProps) => {
  const actionLogForm = st.use.actionLogForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      {/* <p className="w-20 mt-3">{l("actionLog.field")}</p>
        <input className="input input-bordered" value={actionLogForm.id} onChange={(e) => slice.do.setType(e.target.value)} /> */}
    </Layout.Template>
  );
};
