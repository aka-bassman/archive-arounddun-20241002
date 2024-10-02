import { pageProcess } from "@core/common";
import type { Multicall as MulticallContract } from "../typechain-types";
import type { MulticallInput } from ".";

interface Call {
  target: string;
  callData: string;
}
const SCAN_NUM = 5500;

export class Multicall {
  constructor(private readonly contract: MulticallContract) {}
  async view(input: MulticallInput) {
    const scanNum = input.settings.scanNum ?? SCAN_NUM;
    if (!input.calls.length) return [];
    const returnData = await pageProcess({
      name: `Multicall-view`,
      fn: async (from, to) => {
        const calls: Call[] = input.calls.slice(from, to).map((call) => ({
          target: call.address,
          callData: input.settings.intf.encodeFunctionData(call.fn, call.args),
        }));
        const [blockNumber, returnData] = (await this.contract.aggregate(calls)) as unknown as [string, string[]];
        const bn = parseInt(blockNumber.toString());
        const data = input.calls
          .slice(from, from + scanNum)
          .map((call, idx) => [...input.settings.intf.decodeFunctionResult(call.fn, returnData[idx]), bn] as object[]);
        return data;
      },
      to: input.calls.length,
      step: scanNum,
    });
    return returnData;
  }
}
