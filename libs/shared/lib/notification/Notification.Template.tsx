"use client";
import { Layout } from "@util/ui";
import { st, usePage } from "@shared/client";

interface NotificationEditProps {
  notificationId?: string | null;
}

export const General = ({ notificationId = undefined }: NotificationEditProps) => {
  const notificationForm = st.use.notificationForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      {/* <Field label={l.field("modelName", "fieldName")} desc={l.desc("modelName", "fieldName")} /> */}
    </Layout.Template>
  );
};
