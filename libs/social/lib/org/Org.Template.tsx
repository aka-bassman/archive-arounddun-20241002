"use client";
import { Avatar, Layout } from "@util/ui";
import { Field, Only } from "@shared/ui";
import { Org, cnst, st, usePage } from "@social/client";

interface OrgEditProps {
  orgId?: string | null;
}

export const General = ({ orgId = undefined }: OrgEditProps) => {
  const storeUse = st.use as { [key: string]: <T>() => T };
  const self = storeUse.self<cnst.User>();
  const org = st.use.org();
  const orgLoading = st.use.orgLoading();
  const orgForm = st.use.orgForm();
  const { l } = usePage();
  return (
    <Layout.Template>
      <Field.Text
        label={l.field("org", "name")}
        value={orgForm.name}
        onChange={st.do.setNameOnOrg}
        desc={l.desc("org", "name")}
      />
      {!orgLoading && org ? (
        <>
          <Field>
            <Field.Label label={l.field("org", "owners")} desc={l.desc("org", "owners")} />
            <Only.User>
              <Org.Util.Invite type="owner" />
            </Only.User>
            {org.owners.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">
                  <Avatar src={user.image?.url} /> {user.nickname}
                  {self.id === user.id ? " (you)" : null}
                </div>
                <Org.Util.RemoveUser
                  userId={user.id}
                  nickname={user.nickname}
                  orgName={org.name}
                  disabled={self.id === user.id}
                />
              </div>
            ))}
            {org.ownerInvites.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{user.nickname} (inviting)</div>
                <Org.Util.RemoveUser userId={user.id} nickname={user.nickname} orgName={org.name} />
              </div>
            ))}
            {org.ownerInviteEmails.map((email) => (
              <div key={email} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{email} (inviting)</div>
                <Org.Util.RemoveEmail email={email} orgName={org.name} />
              </div>
            ))}
          </Field>
          <Field>
            <Field.Label label={l.field("org", "operators")} desc={l.desc("org", "operators")} />
            <Only.User>
              <Org.Util.Invite type="operator" />
            </Only.User>
            {org.operators.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">
                  <Avatar src={user.image?.url} /> {user.nickname}
                  {self.id === user.id ? " (you)" : null}
                </div>
                <Org.Util.RemoveUser
                  userId={user.id}
                  nickname={user.nickname}
                  orgName={org.name}
                  disabled={self.id === user.id}
                />
              </div>
            ))}
            {org.operatorInvites.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{user.nickname} (inviting)</div>
                <Org.Util.RemoveUser userId={user.id} nickname={user.nickname} orgName={org.name} />
              </div>
            ))}
            {org.operatorInviteEmails.map((email) => (
              <div key={email} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{email} (inviting)</div>
                <Org.Util.RemoveEmail email={email} orgName={org.name} />
              </div>
            ))}
          </Field>
          <Field>
            <Field.Label label={l.field("org", "viewers")} desc={l.desc("org", "viewers")} />
            <Only.User>
              <Org.Util.Invite type="viewer" />
            </Only.User>
            {org.viewers.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">
                  <Avatar src={user.image?.url} /> {user.nickname}
                  {self.id === user.id ? " (you)" : null}
                </div>
                <Org.Util.RemoveUser
                  userId={user.id}
                  nickname={user.nickname}
                  orgName={org.name}
                  disabled={self.id === user.id}
                />
              </div>
            ))}
            {org.viewerInvites.map((user) => (
              <div key={user.id} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{user.nickname} (inviting)</div>
                <Org.Util.RemoveUser userId={user.id} nickname={user.nickname} orgName={org.name} />
              </div>
            ))}
            {org.viewerInviteEmails.map((email) => (
              <div key={email} className="my-1 flex w-full items-center justify-between">
                <div className="ml-4 flex items-center gap-2">{email} (inviting)</div>
                <Org.Util.RemoveEmail email={email} orgName={org.name} />
              </div>
            ))}
          </Field>
        </>
      ) : null}
    </Layout.Template>
  );
};
