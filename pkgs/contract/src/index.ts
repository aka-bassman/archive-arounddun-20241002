/* eslint-disable @nx/workspace/noImportExternalLibrary */
import { AkaMarket } from "../typechain-types";
import { Interface } from "@ethersproject/abi";
import { Multicall } from "./Multicall";
import type { BigNumber } from "@ethersproject/bignumber";
import type { Event } from "ethers";
export type {
  AkaMarket,
  ERC1155,
  ERC20,
  ERC721A,
  ERC721AToken,
  ERC20Migratable,
  Multicall as MulticallContract,
} from "../typechain-types";

export type Erc20TrasferEventHandler = (from: string, to: string, value: BigNumber, event: Event) => void;
export type Erc20ApprovalEventHandler = (owner: string, spender: string, value: BigNumber, event: Event) => void;
export interface Erc20EventHandler {
  onTransfer?: Erc20TrasferEventHandler;
  onApproval?: Erc20ApprovalEventHandler;
}
export interface Erc20Info {
  name: string;
  symbol: string;
  decimals: string;
  totalSupply: number;
  bn: number;
}

export type Erc721TrasferEventHandler = (from: string, to: string, tokenId: BigNumber, event: Event) => void;
export type Erc721ApprovalEventHandler = (owner: string, approved: string, tokenId: BigNumber, event: Event) => void;
export type Erc721ApprovalForAllEventHandler = (
  owner: string,
  operator: string,
  apporved: boolean,
  event: Event
) => void;
export interface Erc721EventHandler {
  onTransfer?: Erc721TrasferEventHandler;
  onApproval?: Erc721ApprovalEventHandler;
  onApprovalForAll?: Erc721ApprovalForAllEventHandler;
}
export interface Erc721Info {
  name: string;
  symbol: string;
  totalSupply: number;
  bn: number;
}

export type Erc1155TrasferSingleEventHandler = (
  operator: string,
  from: string,
  to: string,
  id: BigNumber,
  value: BigNumber,
  event: Event
) => void;
export type Erc1155TrasferBatchEventHandler = (
  operator: string,
  from: string,
  to: string,
  ids: BigNumber[],
  values: BigNumber[],
  event: Event
) => void;
export type Erc1155ApprovalForAllEventHandler = (
  account: string,
  operator: string,
  apporved: boolean,
  event: Event
) => void;
export type Erc1155URIEventHandler = (value: string, id: BigNumber, event: Event) => void;
export interface Erc1155EventHandler {
  onTransferSingle?: Erc1155TrasferSingleEventHandler;
  onTransferBatch?: Erc1155TrasferBatchEventHandler;
  onApprovalForAll?: Erc1155ApprovalForAllEventHandler;
  onURI?: Erc1155URIEventHandler;
}
export interface Erc1155Info {
  bn: number;
}

export interface SinglecallInput { address: string; fn: string; args: any[] }
export interface MulticallInput {
  calls: SinglecallInput[];
  settings: ContractSettings;
}
export interface ContractSettings {
  multicall: Multicall;
  market: AkaMarket;
  abi: any;
  intf: Interface;
  scanNum?: number;
}

export { Multicall } from "./Multicall";
export { Erc721 } from "./Erc721";
export { Erc20 } from "./Erc20";
export { Erc1155 } from "./Erc1155";
export { supportInterfaceAbi } from "./supportInterfaceAbi";
export { erc20Abi } from "./erc20Abi";
export { erc20migratableAbi } from "./erc20migratableAbi";
export { erc721Abi } from "./erc721Abi";
export { erc1155Abi } from "./erc1155Abi";
export { multicallAbi } from "./multicallAbi";
export { marketAbi } from "./marketAbi";
