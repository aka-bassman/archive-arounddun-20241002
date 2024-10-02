"use client";
import { Loading } from "@util/ui";
import { Metamask } from "./wallet";
import { clsx, setAuth } from "@core/client";
import { cnst, fetch } from "@shared/client";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import type { MetaMaskInpageProvider } from "@metamask/providers";

export interface SignWalletProps {
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
  className?: string;
  message?: string;
  address?: string;
  onSigned?: (address: string) => void;
  disabled?: boolean;
  deepLinkUrl?: string;
  children: any;
  loading?: boolean;
}
export default function SignWallet({
  className,
  provider,
  network,
  message = "Connect Wallet",
  address,
  onSigned,
  disabled,
  children,
  deepLinkUrl,
  loading = false,
}: SignWalletProps) {
  const [needLoading, setNeedLoading] = useState(false);
  const sign = async () => {
    try {
      if (disabled) return;
      setNeedLoading(true);
      if (!(window.ethereum as MetaMaskInpageProvider | undefined) && isMobile)
        window.location.assign(
          `https://metamask.app.link/dapp/${window.location.href.slice(
            window.location.protocol === "http:" ? 7 : 8,
            window.location.href.length
          )}`
        );
      const wallet = await new Metamask(provider, network).init();
      // provider === "klaytn"
      //   ? await new Kaikas(provider, network).init()
      //   : // ? await new WalletConnect(provider, walletNetworkType).init()
      //     await new Metamask(provider, network).init();
      const signer = address ?? (await wallet.getAccount());
      const hash = await fetch.encrypt(signer);
      const { signchain, signmessage, signaddress } = await wallet.sign(
        `${message} jwt:[${hash}] timeStamp:${Date.now()}`,
        signer
      );
      const { jwt } = await fetch.updateSignature(signchain, signmessage, signaddress);
      setAuth({ jwt });
      onSigned?.(signer);
      setNeedLoading(false);
    } catch (e) {
      setNeedLoading(false);
    }
  };
  return (
    <>
      {loading && needLoading && (
        <div className="fixed left-0 top-0 z-[60] flex size-full flex-col items-center justify-center bg-black/50 text-2xl text-white duration-300">
          <Loading.Spin />
          Connecting...
        </div>
      )}
      <div className={clsx("cursor-pointer", className)} onClick={() => void sign()}>
        {children}
      </div>
    </>
  );
}
