"use client";
import { Kaikas, Metamask } from "./wallet";
import { clsx } from "@core/client";
import { cnst } from "../../lib/cnst";
import { isMobile } from "react-device-detect";
import { useState } from "react";
import type { MetaMaskInpageProvider } from "@metamask/providers";
import type { PayableOverrides } from "@ethersproject/contracts";
import type { TransactionReceipt } from "@ethersproject/providers";

interface ExecuteContractProps {
  provider: cnst.util.ChainProvider;
  network: cnst.util.ChainNetwork;
  className?: string;
  contract: string;
  abi: { [key: string]: any }[];
  method: string;
  params: any[];
  overrides?: PayableOverrides;
  onExecute?: (receipt: TransactionReceipt) => Promise<void>;
  disabled?: boolean;
  children: any;
}
export default function ExecuteContract({
  className,
  provider,
  network,
  contract,
  abi,
  method,
  params,
  overrides,
  onExecute,
  disabled,
  children,
}: ExecuteContractProps) {
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

    const receipt = await wallet.executeContract(contract, abi, method, params as object[], {
      setLoading,
      ...overrides,
    });
    setLoading("Sending Result...");
    await onExecute?.(receipt);
    setLoading(null);
  };
  return (
    <div className={clsx("cursor-pointer", className)} onClick={() => void sign()}>
      {loading ? (
        <button className="btn btn-primary opacity-50">
          <span className="loading loading-spinner loading-xs md:loading-md" />
          <span className="text-xs md:text-base ">{loading}</span>
        </button>
      ) : (
        children
      )}
    </div>
  );
}
