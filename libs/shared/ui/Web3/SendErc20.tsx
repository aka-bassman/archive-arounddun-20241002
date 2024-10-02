"use client";
import { Kaikas, Metamask } from "./wallet";
import { clsx } from "@core/client";
import { cnst } from "@shared/client";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import type { PayableOverrides } from "@ethersproject/contracts";
import type { TransactionReceipt } from "@ethersproject/providers";

export interface SendErc20Props {
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
  className?: string;
  value: number;
  contract: string;
  to: string;
  onSend?: (receipt: TransactionReceipt) => Promise<void>;
  overrides?: PayableOverrides;
  disabled?: boolean;
  children: any;
}
export default function SendErc20({
  className,
  provider,
  network,
  value,
  contract,
  to,
  onSend,
  overrides,
  disabled,
  children,
}: SendErc20Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const sign = async () => {
    if (!!disabled || !!loading) return;
    if (!(window.ethereum as MetaMaskInpageProvider | undefined) && isMobile)
      window.location.assign(
        `https://metamask.app.link/dapp/${window.location.href.slice(
          window.location.protocol === "http:" ? 7 : 8,
          window.location.href.length
        )}`
      );
    const wallet =
      provider === "klaytn"
        ? await new Kaikas(provider, network).init()
        : // : isMobile
          // ? await new WalletConnect(provider, walletNetworkType).init()
          await new Metamask(provider, network).init();
    const receipt = await wallet.sendErc20(contract, value, to, { setLoading, ...overrides });
    setLoading("Sending Result...");
    await onSend?.(receipt);
    setLoading(null);
  };
  return (
    <div className={clsx("flex cursor-pointer items-center gap-1", className)} onClick={() => void sign()}>
      {loading ? (
        <button className="btn btn-primary opacity-50">
          <span className="loading loading-spinner" />
          <span>{loading}</span>
        </button>
      ) : (
        children
      )}
    </div>
  );
}
