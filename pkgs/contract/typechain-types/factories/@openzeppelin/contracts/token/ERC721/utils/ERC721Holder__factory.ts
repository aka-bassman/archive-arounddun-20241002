/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../../common";
import type {
  ERC721Holder,
  ERC721HolderInterface,
} from "../../../../../../@openzeppelin/contracts/token/ERC721/utils/ERC721Holder";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "",
        type: "bytes",
      },
    ],
    name: "onERC721Received",
    outputs: [
      {
        internalType: "bytes4",
        name: "",
        type: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b5061034d806100206000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063150b7a0214610030575b600080fd5b61004a60048036038101906100459190610106565b610060565b6040516100579190610190565b60405180910390f35b600063150b7a0260e01b9050949350505050565b6000610087610082846101d0565b6101ab565b90508281526020810184848401111561009f57600080fd5b6100aa848285610269565b509392505050565b6000813590506100c1816102e9565b92915050565b600082601f8301126100d857600080fd5b81356100e8848260208601610074565b91505092915050565b60008135905061010081610300565b92915050565b6000806000806080858703121561011c57600080fd5b600061012a878288016100b2565b945050602061013b878288016100b2565b935050604061014c878288016100f1565b925050606085013567ffffffffffffffff81111561016957600080fd5b610175878288016100c7565b91505092959194509250565b61018a81610213565b82525050565b60006020820190506101a56000830184610181565b92915050565b60006101b56101c6565b90506101c18282610278565b919050565b6000604051905090565b600067ffffffffffffffff8211156101eb576101ea6102a9565b5b6101f4826102d8565b9050602081019050919050565b600061020c8261023f565b9050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b610281826102d8565b810181811067ffffffffffffffff821117156102a05761029f6102a9565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b6102f281610201565b81146102fd57600080fd5b50565b6103098161025f565b811461031457600080fd5b5056fea264697066735822122053e8d2314fd6e239585e9bbcfac008edeee8bc6b4f69105b3dfccd37a057ac5464736f6c63430008040033";

type ERC721HolderConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC721HolderConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC721Holder__factory extends ContractFactory {
  constructor(...args: ERC721HolderConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC721Holder> {
    return super.deploy(overrides || {}) as Promise<ERC721Holder>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): ERC721Holder {
    return super.attach(address) as ERC721Holder;
  }
  override connect(signer: Signer): ERC721Holder__factory {
    return super.connect(signer) as ERC721Holder__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721HolderInterface {
    return new utils.Interface(_abi) as ERC721HolderInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC721Holder {
    return new Contract(address, _abi, signerOrProvider) as ERC721Holder;
  }
}
