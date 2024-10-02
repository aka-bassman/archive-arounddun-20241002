/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { AkaToken, AkaTokenInterface } from "../../contracts/AkaToken";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b5060405162001ae238038062001ae2833981810160405281019062000037919062000358565b818181600390805190602001906200005192919062000236565b5080600490805190602001906200006a92919062000236565b505050620000ad3362000082620000b560201b60201c565b60ff16600a6200009391906200056a565b6064620000a19190620006a7565b620000be60201b60201c565b505062000888565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000131576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401620001289062000403565b60405180910390fd5b62000145600083836200022c60201b60201c565b8060026000828254620001599190620004b2565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200020c919062000425565b60405180910390a362000228600083836200023160201b60201c565b5050565b505050565b505050565b828054620002449062000748565b90600052602060002090601f016020900481019282620002685760008555620002b4565b82601f106200028357805160ff1916838001178555620002b4565b82800160010185558215620002b4579182015b82811115620002b357825182559160200191906001019062000296565b5b509050620002c39190620002c7565b5090565b5b80821115620002e2576000816000905550600101620002c8565b5090565b6000620002fd620002f7846200046b565b62000442565b9050828152602081018484840111156200031657600080fd5b6200032384828562000712565b509392505050565b600082601f8301126200033d57600080fd5b81516200034f848260208601620002e6565b91505092915050565b600080604083850312156200036c57600080fd5b600083015167ffffffffffffffff8111156200038757600080fd5b62000395858286016200032b565b925050602083015167ffffffffffffffff811115620003b357600080fd5b620003c1858286016200032b565b9150509250929050565b6000620003da601f83620004a1565b9150620003e7826200085f565b602082019050919050565b620003fd8162000708565b82525050565b600060208201905081810360008301526200041e81620003cb565b9050919050565b60006020820190506200043c6000830184620003f2565b92915050565b60006200044e62000461565b90506200045c82826200077e565b919050565b6000604051905090565b600067ffffffffffffffff82111562000489576200048862000812565b5b620004948262000841565b9050602081019050919050565b600082825260208201905092915050565b6000620004bf8262000708565b9150620004cc8362000708565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620005045762000503620007b4565b5b828201905092915050565b6000808291508390505b60018511156200056157808604811115620005395762000538620007b4565b5b6001851615620005495780820291505b8081029050620005598562000852565b945062000519565b94509492505050565b6000620005778262000708565b9150620005848362000708565b9250620005b37fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8484620005bb565b905092915050565b600082620005cd5760019050620006a0565b81620005dd5760009050620006a0565b8160018114620005f65760028114620006015762000637565b6001915050620006a0565b60ff841115620006165762000615620007b4565b5b8360020a91508482111562000630576200062f620007b4565b5b50620006a0565b5060208310610133831016604e8410600b8410161715620006715782820a9050838111156200066b576200066a620007b4565b5b620006a0565b6200068084848460016200050f565b925090508184048111156200069a5762000699620007b4565b5b81810290505b9392505050565b6000620006b48262000708565b9150620006c18362000708565b9250817fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0483118215151615620006fd57620006fc620007b4565b5b828202905092915050565b6000819050919050565b60005b838110156200073257808201518184015260208101905062000715565b8381111562000742576000848401525b50505050565b600060028204905060018216806200076157607f821691505b60208210811415620007785762000777620007e3565b5b50919050565b620007898262000841565b810181811067ffffffffffffffff82111715620007ab57620007aa62000812565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b60008160011c9050919050565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b61124a80620008986000396000f3fe608060405234801561001057600080fd5b50600436106100a95760003560e01c80633950935111610071578063395093511461016857806370a082311461019857806395d89b41146101c8578063a457c2d7146101e6578063a9059cbb14610216578063dd62ed3e14610246576100a9565b806306fdde03146100ae578063095ea7b3146100cc57806318160ddd146100fc57806323b872dd1461011a578063313ce5671461014a575b600080fd5b6100b6610276565b6040516100c39190610d10565b60405180910390f35b6100e660048036038101906100e19190610b5e565b610308565b6040516100f39190610cf5565b60405180910390f35b61010461032b565b6040516101119190610e12565b60405180910390f35b610134600480360381019061012f9190610b0f565b610335565b6040516101419190610cf5565b60405180910390f35b610152610364565b60405161015f9190610e2d565b60405180910390f35b610182600480360381019061017d9190610b5e565b61036d565b60405161018f9190610cf5565b60405180910390f35b6101b260048036038101906101ad9190610aaa565b6103a4565b6040516101bf9190610e12565b60405180910390f35b6101d06103ec565b6040516101dd9190610d10565b60405180910390f35b61020060048036038101906101fb9190610b5e565b61047e565b60405161020d9190610cf5565b60405180910390f35b610230600480360381019061022b9190610b5e565b6104f5565b60405161023d9190610cf5565b60405180910390f35b610260600480360381019061025b9190610ad3565b610518565b60405161026d9190610e12565b60405180910390f35b60606003805461028590610f42565b80601f01602080910402602001604051908101604052809291908181526020018280546102b190610f42565b80156102fe5780601f106102d3576101008083540402835291602001916102fe565b820191906000526020600020905b8154815290600101906020018083116102e157829003601f168201915b5050505050905090565b60008061031361059f565b90506103208185856105a7565b600191505092915050565b6000600254905090565b60008061034061059f565b905061034d858285610772565b6103588585856107fe565b60019150509392505050565b60006012905090565b60008061037861059f565b905061039981858561038a8589610518565b6103949190610e64565b6105a7565b600191505092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546103fb90610f42565b80601f016020809104026020016040519081016040528092919081815260200182805461042790610f42565b80156104745780601f1061044957610100808354040283529160200191610474565b820191906000526020600020905b81548152906001019060200180831161045757829003601f168201915b5050505050905090565b60008061048961059f565b905060006104978286610518565b9050838110156104dc576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104d390610df2565b60405180910390fd5b6104e982868684036105a7565b60019250505092915050565b60008061050061059f565b905061050d8185856107fe565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610617576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161060e90610dd2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610687576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161067e90610d52565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925836040516107659190610e12565b60405180910390a3505050565b600061077e8484610518565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146107f857818110156107ea576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016107e190610d72565b60405180910390fd5b6107f784848484036105a7565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561086e576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161086590610db2565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1614156108de576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108d590610d32565b60405180910390fd5b6108e9838383610a76565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508181101561096f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161096690610d92565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610a5d9190610e12565b60405180910390a3610a70848484610a7b565b50505050565b505050565b505050565b600081359050610a8f816111e6565b92915050565b600081359050610aa4816111fd565b92915050565b600060208284031215610abc57600080fd5b6000610aca84828501610a80565b91505092915050565b60008060408385031215610ae657600080fd5b6000610af485828601610a80565b9250506020610b0585828601610a80565b9150509250929050565b600080600060608486031215610b2457600080fd5b6000610b3286828701610a80565b9350506020610b4386828701610a80565b9250506040610b5486828701610a95565b9150509250925092565b60008060408385031215610b7157600080fd5b6000610b7f85828601610a80565b9250506020610b9085828601610a95565b9150509250929050565b610ba381610ecc565b82525050565b6000610bb482610e48565b610bbe8185610e53565b9350610bce818560208601610f0f565b610bd781610fd2565b840191505092915050565b6000610bef602383610e53565b9150610bfa82610fe3565b604082019050919050565b6000610c12602283610e53565b9150610c1d82611032565b604082019050919050565b6000610c35601d83610e53565b9150610c4082611081565b602082019050919050565b6000610c58602683610e53565b9150610c63826110aa565b604082019050919050565b6000610c7b602583610e53565b9150610c86826110f9565b604082019050919050565b6000610c9e602483610e53565b9150610ca982611148565b604082019050919050565b6000610cc1602583610e53565b9150610ccc82611197565b604082019050919050565b610ce081610ef8565b82525050565b610cef81610f02565b82525050565b6000602082019050610d0a6000830184610b9a565b92915050565b60006020820190508181036000830152610d2a8184610ba9565b905092915050565b60006020820190508181036000830152610d4b81610be2565b9050919050565b60006020820190508181036000830152610d6b81610c05565b9050919050565b60006020820190508181036000830152610d8b81610c28565b9050919050565b60006020820190508181036000830152610dab81610c4b565b9050919050565b60006020820190508181036000830152610dcb81610c6e565b9050919050565b60006020820190508181036000830152610deb81610c91565b9050919050565b60006020820190508181036000830152610e0b81610cb4565b9050919050565b6000602082019050610e276000830184610cd7565b92915050565b6000602082019050610e426000830184610ce6565b92915050565b600081519050919050565b600082825260208201905092915050565b6000610e6f82610ef8565b9150610e7a83610ef8565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115610eaf57610eae610f74565b5b828201905092915050565b6000610ec582610ed8565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015610f2d578082015181840152602081019050610f12565b83811115610f3c576000848401525b50505050565b60006002820490506001821680610f5a57607f821691505b60208210811415610f6e57610f6d610fa3565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b6111ef81610eba565b81146111fa57600080fd5b50565b61120681610ef8565b811461121157600080fd5b5056fea2646970667358221220975751efb83e1141d4dd89799be878bf78bfc62d41063282780f80b26f657a9964736f6c63430008040033";

type AkaTokenConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: AkaTokenConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class AkaToken__factory extends ContractFactory {
  constructor(...args: AkaTokenConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<AkaToken> {
    return super.deploy(name, symbol, overrides || {}) as Promise<AkaToken>;
  }
  override getDeployTransaction(
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name, symbol, overrides || {});
  }
  override attach(address: string): AkaToken {
    return super.attach(address) as AkaToken;
  }
  override connect(signer: Signer): AkaToken__factory {
    return super.connect(signer) as AkaToken__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AkaTokenInterface {
    return new utils.Interface(_abi) as AkaTokenInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): AkaToken {
    return new Contract(address, _abi, signerOrProvider) as AkaToken;
  }
}
