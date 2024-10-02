"use client";
import { Data, Model } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { ModelsProps } from "@core/client";
import { User, cnst, st } from "@syrs/client";

export const Admin = ({ sliceName = "user", init, query }: ModelsProps<cnst.User>) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={User.Unit.Card}
      renderDashboard={User.Util.Stat}
      renderInsight={User.Util.Insight}
      renderTemplate={User.Template.General}
      renderTitle={(user: DefaultOf<cnst.User>) => user.nickname}
      renderView={(user: cnst.User) => <User.View.General user={user} />}
      type="list"
      columns={["nickname", "status", "lastLoginAt", "createdAt"]}
      actions={(user: cnst.LightUser, idx) => [
        "remove",
        "edit",
        "view",
        user.status === "active"
          ? { type: "restrict", render: () => <User.Util.Restrict id={user.id} /> }
          : { type: "release", render: () => <User.Util.Release id={user.id} /> },
      ]}
    />
  );
};

export const Self = () => {
  const self = st.use.self();
  const userModal = st.use.userModal();
  return userModal === "edit" ? (
    <Model.EditModal type="form" sliceName="user" submitOption={{ path: "self" }}>
      <User.Template.General />
    </Model.EditModal>
  ) : (
    <User.View.General user={self} />
  );
};
