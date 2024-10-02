"use client";
import { Icon } from "@util/ui";
import { LoginForm } from "@core/next";
import { clsx } from "@core/client";
import { cnst, st } from "@shared/client";
import SignWallet from "./SignWallet";

interface ConnectMetamaskProps {
  loginForm?: LoginForm;
  className?: string;
  network: cnst.util.ChainNetwork;
}
export default function ConnectMetamask({ loginForm, className = "", network }: ConnectMetamaskProps) {
  return (
    <SignWallet
      provider="ethereum"
      network={network}
      onSigned={() => {
        void st.do.signuporinChainWallet(loginForm);
      }}
    >
      <div
        className={clsx(
          `flex w-fit cursor-pointer items-center justify-center rounded bg-slate-700 px-6 py-4 text-white drop-shadow-lg transition duration-500 hover:bg-slate-600`,
          className
        )}
      >
        <Icon.Metamask width={64} className="mr-4 w-full" />
        <div className="whitespace-nowrap">
          Connect With
          <br />
          MetaMask
        </div>
      </div>
    </SignWallet>
  );
}
