"use client";
import { Data } from "@shared/ui";
import { DefaultOf } from "@core/base";
import { Keyring, cnst, st } from "@shared/client";
import { ModelsProps } from "@core/client";

export const Admin = ({
  sliceName = "keyring",
  init,
  query,
  viewUser,
  editUser,
}: ModelsProps<cnst.Keyring> & {
  viewUser: ({ user }: { user: any }) => JSX.Element;
  editUser?: (props?: { className?: string }) => JSX.Element;
}) => {
  return (
    <Data.ListContainer
      init={init}
      query={query}
      sliceName={sliceName}
      renderItem={Keyring.Unit.Card}
      renderDashboard={Keyring.Util.Stat}
      renderInsight={Keyring.Util.Insight}
      renderTemplate={Keyring.Template.General}
      renderTitle={(keyring: DefaultOf<cnst.Keyring>) => `${keyring.accountId ?? keyring.name}`}
      renderView={(keyring: cnst.Keyring) => <Keyring.View.General keyring={keyring} />}
      type="list"
      columns={[
        {
          key: "accountId",
          render: (_, keyring: cnst.Keyring) =>
            (keyring.accountId?.length ? keyring.accountId : "") + (keyring.name?.length ? ` (${keyring.name})` : ""),
        },
        "phone",
        { key: "verifies", render: (verifies: cnst.Verify[]) => verifies.join(", ") },
        "status",
      ]}
      actions={(keyring: cnst.LightKeyring) => [
        "edit",
        "remove",
        ...(keyring.user
          ? [{ type: "viewUser", render: () => <Keyring.Util.ViewUser userId={keyring.user} viewUser={viewUser} /> }]
          : editUser
            ? [
                {
                  type: "createUser",
                  render: () => <Keyring.Util.CreateUserForKeyringByAdmin keyringId={keyring.id} editUser={editUser} />,
                },
              ]
            : []),
      ]}
    />
  );
};
interface MyCryptoProps {
  className?: string;
  walletPolicy?: "single" | "multple";
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
}
export const MyCrypto = ({ provider, network, className, walletPolicy }: MyCryptoProps) => {
  const myKeyring = st.use.myKeyring();
  return (
    <Keyring.View.Crypto
      keyring={myKeyring}
      className={className}
      walletPolicy={walletPolicy}
      provider={provider}
      network={network}
    />
  );
};
interface MyDiscordProps {
  className?: string;
  imageUrl?: string;
  joinUrl: string;
}
export const MyDiscord = ({ className, imageUrl, joinUrl }: MyDiscordProps) => {
  const myKeyring = st.use.myKeyring();
  return <Keyring.View.Discord className={className} keyring={myKeyring} imageUrl={imageUrl} joinUrl={joinUrl} />;
};

export const Self = () => {
  const myKeyring = st.use.myKeyring();
  return <Keyring.View.General keyring={myKeyring} />;
};
