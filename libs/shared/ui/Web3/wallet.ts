/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { Contract, PayableOverrides } from "@ethersproject/contracts";
import { ERC20, erc20Abi, erc721Abi } from "@contract";
import { default as EthereumProvider } from "@walletconnect/ethereum-provider";
import {
  type ExternalProvider,
  TransactionReceipt,
  type TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";
import { cnst } from "@shared/client";
import { decToHex } from "@core/common";
import { isMobile } from "react-device-detect";
import { parseEther, parseUnits } from "@ethersproject/units";
import type { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    klaytn: {
      enable: () => Promise<string[]>;
      sendAsync: (params: any, callback: (error: any, result: any) => void) => Promise<void>;
    };
    caver: {
      klay: {
        sign: (...args) => Promise<string>;
        sendTransaction: (...args) => Promise<TransactionResponse>;
        Contract: new (abi: any, address: string) => Contract;
      };
      toPeb: (value: string, unit: string) => string;
    };
  }
}
export type WalletType = "kaikas" | "metamask" | "walletConnect";
interface Chain {
  name: string;
  chainId: string;
  rpcUrls: string[];
  nativeCurrency?: { name: string; symbol: string; decimals: number };
}
type ChainMap = { [key in cnst.util.ChainProvider]?: { [key in cnst.util.ChainNetwork]?: Chain } };
interface HandleResult {
  setLoading?: (loading: string | null) => void;
}
type ExecutionOption = PayableOverrides & HandleResult;
export abstract class Wallet {
  chain: Chain;
  initialized = false;
  supportedChains: ChainMap;
  init: () => Promise<Wallet>;
  sign: (message: string, address?: string) => Promise<cnst.util.WalletSign>;
  getAccount: () => Promise<string>;
  sendValue: (value: number, to: string, options?: ExecutionOption) => Promise<TransactionReceipt>;
  sendErc20: (contract: string, num: number, to: string, options?: ExecutionOption) => Promise<TransactionReceipt>;
  openModal: () => void;
  executeContract: (
    contractAddr: string,
    abi: any,
    method: string,
    params: any[],
    options?: ExecutionOption
  ) => Promise<TransactionReceipt>;
  // setApprovalForAll: (ctrAddr: string, operator: string) => Promise<string>;
}
export class Metamask implements Wallet {
  chain: Chain;
  initialized = false;
  provider: Web3Provider;
  supportedChains: ChainMap = {
    ethereum: {
      "ethereum-mainnet": {
        name: "Ethereum Mainnet",
        chainId: "1",
        rpcUrls: ["https://ethereum-mainnet-rpc.allthatnode.com"],
      },
      "ethereum-sepolia": {
        name: "Ethereum Goerli Testnet",
        chainId: "5",
        rpcUrls: ["https://ethereum-goerli-rpc.allthatnode.com"],
      },
    },
    klaytn: {
      "klaytn-cypress": { name: "Cypress Mainnet", chainId: "8217", rpcUrls: ["https://public-en-cypress.klaytn.net"] },
      "klaytn-baobab": { name: "Baobab Testnet", chainId: "1001", rpcUrls: ["https://public-en-baobab.klaytn.net"] },
    },
  };
  constructor(provider: cnst.util.ChainProvider, network: cnst.util.ChainNetwork) {
    if (!window.ethereum.isMetaMask as boolean) throw new Error("No Metamask");
    const chain = this.supportedChains[provider]?.[network];
    if (!chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
    this.chain = chain;
    this.provider = new Web3Provider(window.ethereum as unknown as ExternalProvider, "any");
  }
  async init() {
    this.initialized = true;
    return new Promise<this>((resolve, reject) => {
      resolve(this);
    });
  }
  openModal() {
    return;
  }
  async sign(signmessage: string, address?: string) {
    await this.#validateChain(address);
    const account = await this.getAccount();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = await window.ethereum.request<string>({
      method: "personal_sign",
      params: [signmessage, address ?? account],
    });
    if (!signaddress) throw new Error("No Sign Address");
    return { signchain: this.chain.chainId, signmessage, signaddress };
  }
  async getAccount() {
    const [address] = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain(address?: string) {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [
        {
          chainId: decToHex(parseInt(this.chain.chainId)),
          chainName: this.chain.name,
          rpcUrls: this.chain.rpcUrls,
          nativeCurrency: this.chain.nativeCurrency,
        },
      ],
    });
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: decToHex(parseInt(this.chain.chainId)) }],
    });
    if (address && address !== (await this.getAccount()))
      await window.ethereum.request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }],
      });
    return this;
  }
  async sendValue(value: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      setLoading?.("Sending Transaction...");
      const transaction = await signer.sendTransaction({
        to,
        value: parseEther(value.toString()),
      });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
  async sendErc20(ctrAddr: string, num: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      const contract = new Contract(ctrAddr, erc20Abi, signer) as unknown as ERC20;
      const decimals = await contract.decimals();
      const value = parseUnits(num.toString(), decimals);
      const gasPrice = await this.provider.getGasPrice();
      setLoading?.("Sending Transaction...");
      const transaction = await contract.connect(signer).transfer(to, value, { gasLimit: 100000, gasPrice, ...opt });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
  async executeContract(
    contractAddr: string,
    abi: { [key: string]: any }[],
    method: string,
    params: object[],
    { setLoading, ...overrides }: ExecutionOption = {}
  ) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      const contract = new Contract(contractAddr, abi, signer);
      setLoading?.("Sending Transaction...");
      const transaction = await (contract.connect(signer)[method] as (...args) => Promise<TransactionResponse>)(
        ...params,
        overrides
      );
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
}
export class Kaikas implements Wallet {
  chain: Chain;
  initialized = false;
  supportedChains: ChainMap = {
    klaytn: {
      "klaytn-cypress": { name: "Cypress Mainnet", chainId: "8217", rpcUrls: ["https://public-en-cypress.klaytn.net"] },
      "klaytn-baobab": { name: "Baobab Testnet", chainId: "1001", rpcUrls: ["https://public-en-baobab.klaytn.net"] },
    },
  };
  constructor(provider: cnst.util.ChainProvider, network: cnst.util.ChainNetwork) {
    if (isMobile) {
      window.alert("Kaikas is not supported on mobile");
      throw new Error("Kaikas is not supported on mobile");
    }
    if (!window.klaytn as boolean) {
      window.alert("Kaikas plugin is not installed");
      throw new Error("No Kaikas");
    }
    const chain = this.supportedChains[provider]?.[network];
    if (!chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
    this.chain = chain;
  }
  async sign(signmessage: string, address?: string) {
    await this.#validateChain();
    const account = await this.getAccount();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = await window.caver.klay.sign(signmessage, address ?? account);
    return { signchain: this.chain.chainId, signmessage, signaddress };
  }
  async init() {
    this.initialized = true;
    return new Promise<this>((resolve, reject) => {
      resolve(this);
    });
  }
  openModal() {
    return;
  }
  async getAccount() {
    const [address] = await window.klaytn.enable();
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain() {
    await window.klaytn.sendAsync(
      {
        method: "wallet_switchKlaytnChain",
        params: [{ chainId: decToHex(parseInt(this.chain.chainId)) }],
      },
      () => {
        //
      }
    );
    return this;
  }
  async sendValue(value: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const from = await this.getAccount();
      setLoading?.("Sending Transaction...");
      const transaction = await window.caver.klay.sendTransaction({
        type: "VALUE_TRANSFER",
        from,
        to,
        value: window.caver.toPeb(value.toString(), "KLAY"),
      });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
  async sendErc20(ctrAddr: string, num: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const from = await this.getAccount();
      const contract = new window.caver.klay.Contract(erc20Abi, ctrAddr);
      const decimals = (await contract.methods.decimals().call()) as number;
      const value = parseUnits(num.toString(), decimals);
      const gas = await contract.methods.transfer(to, value).estimateGas({ from });
      setLoading?.("Sending Transaction...");
      const transaction = await contract.methods.transfer(to, value).send({ from, gas });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt as TransactionReceipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }

  async setApprovalForAll(ctrAddr: string, operator: string) {
    const from = await this.getAccount();
    await this.#validateChain();
    const contract = new window.caver.klay.Contract(erc721Abi, ctrAddr);
    const approved = await contract.methods.isApprovedForAll(from, operator).call();
    if (!approved) {
      const gas = await contract.methods.setApprovalForAll(operator, true).estimateGas({ from });
      await contract.methods.setApprovalForAll(operator, true).send({ from, gas });
    }
  }
  async executeContract(
    contractAddr: string,
    abi: any,
    method: string,
    params: any[],
    { setLoading, ...overrides }: ExecutionOption = {}
  ) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const from = this.getAccount();
      const contract = new window.caver.klay.Contract(abi, contractAddr);
      const gas = await contract.methods[method](...params).estimateGas({ from });
      setLoading?.("Sending Transaction...");
      const transaction = await contract.methods[method](...params).send({ from, gas, ...overrides });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt as TransactionReceipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
}
export class WalletConnect implements Wallet {
  static ethProvider: EthereumProvider;
  chainId: string;
  initialized = false;
  supportedChains: ChainMap = {
    ethereum: {
      "ethereum-mainnet": {
        name: "Ethereum Mainnet",
        chainId: "1",
        rpcUrls: ["https://ethereum-mainnet-rpc.allthatnode.com"],
      },
      "ethereum-sepolia": {
        name: "Ethereum Sepolia Testnet",
        chainId: "11155111",
        rpcUrls: ["https://ethereum-sepolia-rpc.allthatnode.com"],
      },
    },
  };
  chain: Chain;
  etherProvider: EthereumProvider;
  provider: Web3Provider;
  connected = false;
  constructor(provider: cnst.util.ChainProvider, network: cnst.util.ChainNetwork) {
    const chain = this.supportedChains[provider]?.[network];
    if (!chain) {
      window.alert("Unsupported chain or Network");
      throw new Error("Unsupported chain");
    }
    this.chain = chain;
  }
  async init() {
    this.etherProvider =
      (WalletConnect.ethProvider as EthereumProvider | undefined) ??
      (await EthereumProvider.init({
        projectId: "d9ec5e10af1371a7ce85f68819d5c2fb", // required
        chains: [Number(this.chain.chainId)], // required
        // chains: [1, 5], // required
        showQrModal: true, // requires @walletconnect/modal
      }));
    WalletConnect.ethProvider = this.etherProvider;

    this.initialized = true;

    await this.connect();
    this.connected = this.etherProvider.connected;
    this.provider = new Web3Provider(this.etherProvider);
    return this;
  }
  openModal() {
    this.etherProvider.modal?.openModal();
  }
  async connect() {
    await this.etherProvider.connect();
    // await this.#validateChain();
    // await this.etherProvider.enable();
  }
  async sign(signmessage: string, account: string, address?: string) {
    // await this.#validateChain();
    if (address && address !== account) {
      const message = `Address is Different. Requested: ${address}, Current: ${account}`;
      window.alert(message);
      throw new Error(message);
    }
    const signaddress = await this.etherProvider.request<string>({
      method: "personal_sign",
      params: [signmessage, address ?? account],
    });
    return { signchain: this.chainId, signmessage, signaddress };
  }
  async getAccount() {
    const [address] = await this.etherProvider.request<string[]>({
      method: "eth_requestAccounts",
    });
    if (!address) throw new Error("No Address");
    return address.toLowerCase();
  }
  async #validateChain() {
    // await this.etherProvider.request({
    //   method: "wallet_switchEthereumChain",
    //   params: [{ chainId: decToHex(parseInt(this.chain.chainId)) }],
    // });
    // if (address && address !== (await this.getAccount()))
    //   await this.etherProvider.request({
    //     method: "wallet_requestPermissions",
    //     params: [{ eth_accounts: {} }],
    //   });
    // return this;
    try {
      const rst = await this.etherProvider.request<string>({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: decToHex(parseInt(this.chain.chainId)) }],
      });
      return this;
    } catch (e) {
      await this.etherProvider.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: decToHex(parseInt(this.chain.chainId)),
            chainName: this.chain.name,
            rpcUrls: this.chain.rpcUrls,
          },
        ],
        // params: [
        //   {
        //     chainId: '0xf00',
        //     chainName: '...',
        //     rpcUrls: ['https://...'] /* ... */,
        //   },
        // ],
      });
    }
  }
  async sendValue(value: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      setLoading?.("Sending Transaction...");
      const transaction = await signer.sendTransaction({
        to,
        value: parseEther(value.toString()),
      });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
  async sendErc20(ctrAddr: string, num: number, to: string, { setLoading, ...opt }: ExecutionOption = {}) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      const contract = new Contract(ctrAddr, erc20Abi, this.provider) as ERC20;
      const decimals = await contract.decimals();
      const value = parseUnits(num.toString(), decimals);
      const gasPrice = await this.provider.getGasPrice();
      setLoading?.("Sending Transaction...");
      const transaction = await contract.connect(signer).transfer(to, value, { gasLimit: 100000, gasPrice });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
  async executeContract(
    contractAddr: string,
    abi: { [key: string]: any }[],
    method: string,
    params: any[],
    { setLoading, ...overrides }: ExecutionOption = {}
  ) {
    try {
      setLoading?.("Starting...");
      setLoading?.("Validating Chain...");
      await this.#validateChain();
      const signer = this.provider.getSigner();
      const contract = new Contract(contractAddr, abi, signer);
      setLoading?.("Sending Transaction...");
      const transaction = await contract.connect(signer)[method](...params, { ...overrides });
      setLoading?.("Waiting Confirmation...");
      const receipt = await transaction.wait();
      setLoading?.(null);
      return receipt as TransactionReceipt;
    } catch (e) {
      setLoading?.(null);
      throw e;
    }
  }
}

// let link: string;
// if (isMobile) {
//   link = `https://metamask.app.link/dapp/${window.location.href.slice(
//     window.location.protocol === "http:" ? 7 : 8,
//     window.location.href.length
//   )}`;
//   // setLink(link);
//   window.location.assign(link);
// } else {
//   link = "https://metamask.io/download/";
//   const win = window.open(link, "_blank");
//   win?.focus();
// }
// };
