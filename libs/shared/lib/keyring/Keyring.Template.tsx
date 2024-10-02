"use client";
import { Field, Only } from "@shared/ui";
import { Keyring, st, usePage } from "@shared/client";
import { Layout } from "@util/ui";

interface KeyringEditProps {
  keyringId?: string | null;
}

export const General = ({ keyringId = undefined }: KeyringEditProps) => {
  const keyring = st.use.keyring();
  const keyringForm = st.use.keyringForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("keyring", "name")}
        desc={l.desc("keyring", "name")}
        value={keyringForm.name}
        onChange={st.do.setNameOnKeyring}
      />
      {keyring ? (
        <Only.Admin>
          <Keyring.Util.ChangeAccountIdByAdmin accountId={keyring.accountId} />
          <Keyring.Util.ChangePasswordByAdmin />
          <Keyring.Util.ChangePhoneByAdmin phone={keyring.phone} />
        </Only.Admin>
      ) : null}
    </Layout.Template>
  );
};
