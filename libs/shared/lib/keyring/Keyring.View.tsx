import { Icon, Image } from "@util/ui";
import { Keyring, cnst, usePage } from "@shared/client";
import { clsx } from "@core/client";

interface KeyringViewProps {
  className?: string;
  keyring: cnst.Keyring;
  siteKey?: string;
}
export const General = ({ className, keyring, siteKey }: KeyringViewProps) => {
  const { l } = usePage();
  return (
    <div className={clsx(`flex flex-col gap-2`, className)}>
      {keyring.accountId?.length ? (
        <div>
          <div className="font-bold">{l("keyring.accountId")}</div>
          <p className="text-base">{keyring.accountId}</p>
        </div>
      ) : null}
      {keyring.verifies.includes("password") ? (
        <div>
          <div className="font-bold">{l("keyring.password")}</div>
          <p className="text-base">
            ********{" "}
            {keyring.verifies.includes("phone") ? (
              <Keyring.Util.ChangePasswordWithPhone />
            ) : siteKey ? (
              <Keyring.Util.ChangePassword siteKey={siteKey} />
            ) : null}
          </p>
        </div>
      ) : null}
      {keyring.phone?.length ? (
        <div>
          <div className="text-2xl font-bold">{l("keyring.phone")}</div>
          <p className="pl-2 pt-2 text-lg">{keyring.phone}</p>
        </div>
      ) : null}
    </div>
  );
};

interface CryptoProps {
  className?: string;
  keyring: cnst.Keyring;
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
  walletPolicy?: "single" | "multple";
}
export const Crypto = ({ className, keyring, walletPolicy = "single", network, provider }: CryptoProps) => {
  return (
    <div className={className}>
      <div className="flex items-center">
        <div className="inline">
          <Icon.Metamask width={40} />
        </div>
        <p className="ml-1 text-2xl">Wallets</p>
      </div>
      <div className="-mb-4 flex flex-col rounded-2xl border border-slate-200 p-4 text-center">
        <div className="mb-2 text-xl text-gray-500 md:mt-0">
          {keyring.chainWallets.map((chainWallet, idx) =>
            keyring.chainWallets.length === 1 ? (
              <p className="mb-1" key={idx}>
                {chainWallet.getShortenedAddress()}
              </p>
            ) : (
              <Keyring.Util.SignsubChainWallet network={network} address={chainWallet.address} key={idx}>
                <p className="mb-1">{chainWallet.getShortenedAddress()}</p>
              </Keyring.Util.SignsubChainWallet>
            )
          )}
        </div>
      </div>
      {walletPolicy === "multple" || !keyring.chainWallets.length ? (
        <Keyring.Util.SignaddChainWallet provider={provider} network={network} />
      ) : null}
    </div>
  );
};

interface DiscordProps {
  className?: string;
  keyring: cnst.Keyring;
  imageUrl?: string;
  joinUrl: string;
}
export const Discord = ({ className, imageUrl, joinUrl, keyring }: DiscordProps) => {
  return keyring.discord ? (
    <div className={className}>
      <div className="flex items-center">
        <Icon.Discord className="fill-[#5865F2]" width="40" />
        <p className="ml-2 text-2xl">Discord</p>
      </div>
      <div className="rounded-2xl border border-slate-200 p-4 text-center">
        <div className="flex items-center space-x-4">
          {imageUrl ? (
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-600">
              <Image src={imageUrl} width={32} height={32} />
            </div>
          ) : null}
          <div className="">{keyring.discord.nickname ?? keyring.discord.user?.username}</div>
        </div>
      </div>
    </div>
  ) : (
    <div className={className}>
      <div className="-mb-4 flex items-center">
        <Icon.Discord className="mb-5 fill-gray-500" viewBox="0 0 50 50" width={40} />
        <p className="ml-2 text-2xl text-gray-500">Discord</p>
      </div>
      <div className="rounded-2xl border border-gray-500 p-4 text-center">
        <div className="mb-1 flex flex-col">
          <p className="mb-2 text-2xl font-light text-gray-400">Not Connected</p>
          <p className="text-x mb-4 whitespace-pre font-light text-gray-400">
            Join our Discord and
            <br />
            link your Discord account!
          </p>
        </div>
        <a
          href={joinUrl}
          target="_blank"
          rel="noreferrer"
          className="block drop-shadow-xl transition md:hover:translate-y-px"
        >
          <Image src="/libs/shared/discord/join_light.png" width={218} height={70} />
        </a>
      </div>
    </div>
  );
};
