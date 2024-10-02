import { getMerkleTree } from "./merkle";
import { parseEther } from "@ethersproject/units";
import dayjs from "dayjs";
import type { BigNumber } from "@ethersproject/bignumber";
export const publicMerkleRoot = "0x0000000000000000000000000000000000000000000000000000000000000000";

export interface SaleInfo {
  amount: number;
  price: number;
  startTime: Date;
  endTime: Date;
  merkleRoot: string;
  perTx: number;
  perWallet: number;
  maxLimit: number;
  minted: number;
}

export const saleInfosToArrays = (saleInfos: SaleInfo[]) =>
  [
    saleInfos.map((saleInfo) => saleInfo.amount),
    saleInfos.map((saleInfo) => parseEther(saleInfo.price.toString())),
    saleInfos.map((saleInfo) => Math.floor(saleInfo.startTime.getTime() / 1000)),
    saleInfos.map((saleInfo) => Math.floor(saleInfo.endTime.getTime() / 1000)),
    saleInfos.map((saleInfo) => saleInfo.merkleRoot),
    saleInfos.map((saleInfo) => saleInfo.perTx),
    saleInfos.map((saleInfo) => saleInfo.perWallet),
    saleInfos.map((saleInfo) => saleInfo.maxLimit),
  ] as [number[], BigNumber[], number[], number[], string[], number[], number[], number[]];
export const makeSaleInfo = (addresses: string[], amount: number): SaleInfo => ({
  amount,
  price: 0, // 1 eth
  startTime: dayjs().toDate(),
  endTime: dayjs().add(10000, "year").toDate(),
  merkleRoot: getMerkleTree(addresses).root,
  perTx: 0,
  perWallet: 0,
  maxLimit: 0,
  minted: 0,
});
