"use client";
import { Field } from "@shared/ui";
import { Layout } from "@util/ui";
import { st, usePage } from "@shared/client";

interface AdminEditProps {
  adminId?: string | null;
}

export const General = ({ adminId = undefined }: AdminEditProps) => {
  const adminForm = st.use.adminForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("admin", "accountId")}
        desc={l.desc("admin", "accountId")}
        value={adminForm.accountId}
        onChange={st.do.setAccountIdOnAdmin}
      />
      <Field.Password
        label={l.field("admin", "password")}
        desc={l.desc("admin", "password")}
        value={adminForm.password}
        onChange={(password) => { st.do.setPasswordOnAdmin(password); }}
      />
    </Layout.Template>
  );
};
