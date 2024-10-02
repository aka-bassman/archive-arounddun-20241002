import type { ContractSettings, Erc1155EventHandler, Erc1155Info } from ".";
import type { ERC1155 } from "../typechain-types";

export class Erc1155 {
  constructor(
    readonly address: string,
    readonly contract: ERC1155,
    readonly settings: ContractSettings
  ) {}
  async info(): Promise<Erc1155Info> {
    const bn = await this.contract.provider.getBlockNumber();
    return { bn };
  }
  async snapshot(owners: string[], ids: number[]) {
    return await this.balances(owners, ids);
  }
  async inventory(owner: string, contracts: { address: string; id: number }[]) {
    const ret = (
      await this.settings.multicall.view({
        calls: contracts.map((contract) => ({
          address: contract.address,
          fn: "balanceOf",
          args: [owner, contract.id],
        })),
        settings: this.settings,
      })
    ).map((ret, idx) => ({
      address: owner,
      value: parseInt((ret[0] as unknown as number).toString()),
      tokenId: contracts[idx].id,
      bn: ret[1],
      contract: contracts[idx].address,
    }));
    return ret;
  }
  async tokenUris(ids: number[]) {
    const uris = (
      await this.settings.multicall.view({
        calls: ids.map((id) => ({
          address: this.address,
          fn: "uri",
          args: [id],
        })),
        settings: this.settings,
      })
    ).map((ret) => ret[0] as unknown as string);
    return uris;
  }
  async balances(owners: string[], ids: number[]) {
    const balances = (
      await this.settings.multicall.view({
        calls: owners.map((address) => ({
          address: this.address,
          fn: "balanceOfBatch",
          args: [new Array(ids.length).fill(address), ids],
        })),
        settings: this.settings,
      })
    ).reduce<{ address: string; value: number; tokenId: number; bn: number }[]>(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      (acc: any[], ret: any[], index) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        [
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          ...acc,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          ...(ret[0].map((value, idx: number) => ({
            address: owners[index],
            value: parseInt((value as unknown as number).toString()),
            tokenId: ids[idx],
            bn: ret[1] as unknown as number,
          })) as any[]),
        ] as any[],
      []
    );
    return balances as unknown as { address: string; value: number; tokenId: number; bn: number }[];
  }
  async checkApproval(owner: string, id: number, amount: number) {
    return (
      (await this.contract.isApprovedForAll(owner, this.settings.market.address)) &&
      (await this.#balanceOf(owner, id)) >= amount
    );
  }
  async transfer(from: string, to: string, id: number, amount: number) {
    await this.settings.market.transferErc1155(this.address, from, to, id, amount, "0x00");
    return true;
  }
  listen({ onTransferSingle, onTransferBatch, onApprovalForAll, onURI }: Erc1155EventHandler) {
    this.contract.removeAllListeners();
    onTransferSingle && this.contract.on("TransferSingle", onTransferSingle);
    onTransferBatch && this.contract.on("TransferBatch", onTransferBatch);
    onApprovalForAll && this.contract.on("ApprovalForAll", onApprovalForAll);
    onURI && this.contract.on("URI", onURI);
  }
  destroy() {
    this.contract.removeAllListeners();
  }
  async #balanceOf(owner: string, id: number) {
    return parseInt((await this.contract.balanceOf(owner, id)).toString());
  }
}
