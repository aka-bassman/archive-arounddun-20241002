/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../../../../common";
import type {
  ERC1155,
  ERC1155Interface,
} from "../../../../../@openzeppelin/contracts/token/ERC1155/ERC1155";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "uri_",
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
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        indexed: false,
        internalType: "uint256[]",
        name: "values",
        type: "uint256[]",
      },
    ],
    name: "TransferBatch",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
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
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "TransferSingle",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "string",
        name: "value",
        type: "string",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "URI",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
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
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
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
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
      {
        internalType: "uint256[]",
        name: "amounts",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeBatchTransferFrom",
    outputs: [],
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
        name: "id",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
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
] as const;

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620029423803806200294283398181016040528101906200003791906200018d565b62000048816200004f60201b60201c565b5062000342565b8060029080519060200190620000679291906200006b565b5050565b828054620000799062000267565b90600052602060002090601f0160209004810192826200009d5760008555620000e9565b82601f10620000b857805160ff1916838001178555620000e9565b82800160010185558215620000e9579182015b82811115620000e8578251825591602001919060010190620000cb565b5b509050620000f89190620000fc565b5090565b5b8082111562000117576000816000905550600101620000fd565b5090565b6000620001326200012c84620001fb565b620001d2565b9050828152602081018484840111156200014b57600080fd5b6200015884828562000231565b509392505050565b600082601f8301126200017257600080fd5b8151620001848482602086016200011b565b91505092915050565b600060208284031215620001a057600080fd5b600082015167ffffffffffffffff811115620001bb57600080fd5b620001c98482850162000160565b91505092915050565b6000620001de620001f1565b9050620001ec82826200029d565b919050565b6000604051905090565b600067ffffffffffffffff82111562000219576200021862000302565b5b620002248262000331565b9050602081019050919050565b60005b838110156200025157808201518184015260208101905062000234565b8381111562000261576000848401525b50505050565b600060028204905060018216806200028057607f821691505b60208210811415620002975762000296620002d3565b5b50919050565b620002a88262000331565b810181811067ffffffffffffffff82111715620002ca57620002c962000302565b5b80604052505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6000601f19601f8301169050919050565b6125f080620003526000396000f3fe608060405234801561001057600080fd5b50600436106100875760003560e01c80634e1273f41161005b5780634e1273f414610138578063a22cb46514610168578063e985e9c514610184578063f242432a146101b457610087565b8062fdd58e1461008c57806301ffc9a7146100bc5780630e89341c146100ec5780632eb2c2d61461011c575b600080fd5b6100a660048036038101906100a1919061181f565b6101d0565b6040516100b39190611e19565b60405180910390f35b6100d660048036038101906100d191906118c7565b610299565b6040516100e39190611cbc565b60405180910390f35b61010660048036038101906101019190611919565b61037b565b6040516101139190611cd7565b60405180910390f35b61013660048036038101906101319190611695565b61040f565b005b610152600480360381019061014d919061185b565b6104b0565b60405161015f9190611c63565b60405180910390f35b610182600480360381019061017d91906117e3565b610661565b005b61019e60048036038101906101999190611659565b610677565b6040516101ab9190611cbc565b60405180910390f35b6101ce60048036038101906101c99190611754565b61070b565b005b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610241576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161023890611d19565b60405180910390fd5b60008083815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b60007fd9b67a26000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916148061036457507f0e89341c000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916145b806103745750610373826107ac565b5b9050919050565b60606002805461038a90612088565b80601f01602080910402602001604051908101604052809291908181526020018280546103b690612088565b80156104035780601f106103d857610100808354040283529160200191610403565b820191906000526020600020905b8154815290600101906020018083116103e657829003601f168201915b50505050509050919050565b610417610816565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff16148061045d575061045c85610457610816565b610677565b5b61049c576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161049390611d39565b60405180910390fd5b6104a9858585858561081e565b5050505050565b606081518351146104f6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104ed90611db9565b60405180910390fd5b6000835167ffffffffffffffff811115610539577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280602002602001820160405280156105675781602001602082028036833780820191505090505b50905060005b8451811015610656576106008582815181106105b2577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101518583815181106105f3577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101516101d0565b828281518110610639577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b6020026020010181815250508061064f906120eb565b905061056d565b508091505092915050565b61067361066c610816565b8383610b8c565b5050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16905092915050565b610713610816565b73ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff161480610759575061075885610753610816565b610677565b5b610798576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161078f90611d39565b60405180910390fd5b6107a58585858585610cf9565b5050505050565b60007f01ffc9a7000000000000000000000000000000000000000000000000000000007bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916827bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916149050919050565b600033905090565b8151835114610862576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161085990611dd9565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff1614156108d2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016108c990611d59565b60405180910390fd5b60006108dc610816565b90506108ec818787878787610f95565b60005b8451811015610ae9576000858281518110610933577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b602002602001015190506000858381518110610978577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101519050600080600084815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610a19576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1090611d79565b60405180910390fd5b81810360008085815260200190815260200160002060008c73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508160008085815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ace9190611f7c565b9250508190555050505080610ae2906120eb565b90506108ef565b508473ffffffffffffffffffffffffffffffffffffffff168673ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff167f4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb8787604051610b60929190611c85565b60405180910390a4610b76818787878787610f9d565b610b84818787878787610fa5565b505050505050565b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610bfb576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610bf290611d99565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c3183604051610cec9190611cbc565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff161415610d69576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610d6090611d59565b60405180910390fd5b6000610d73610816565b90506000610d808561118c565b90506000610d8d8561118c565b9050610d9d838989858589610f95565b600080600088815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905085811015610e34576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610e2b90611d79565b60405180910390fd5b85810360008089815260200190815260200160002060008b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508560008089815260200190815260200160002060008a73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610ee99190611f7c565b925050819055508773ffffffffffffffffffffffffffffffffffffffff168973ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f628a8a604051610f66929190611e34565b60405180910390a4610f7c848a8a86868a610f9d565b610f8a848a8a8a8a8a611252565b505050505050505050565b505050505050565b505050505050565b610fc48473ffffffffffffffffffffffffffffffffffffffff16611439565b15611184578373ffffffffffffffffffffffffffffffffffffffff1663bc197c8187878686866040518663ffffffff1660e01b815260040161100a959493929190611ba1565b602060405180830381600087803b15801561102457600080fd5b505af192505050801561105557506040513d601f19601f8201168201806040525081019061105291906118f0565b60015b6110fb576110616121c1565b806308c379a014156110be57506110766124c8565b8061108157506110c0565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110b59190611cd7565b60405180910390fd5b505b6040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016110f290611df9565b60405180910390fd5b63bc197c8160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff191614611182576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161117990611cf9565b60405180910390fd5b505b505050505050565b60606000600167ffffffffffffffff8111156111d1577f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040519080825280602002602001820160405280156111ff5781602001602082028036833780820191505090505b509050828160008151811061123d577f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60200260200101818152505080915050919050565b6112718473ffffffffffffffffffffffffffffffffffffffff16611439565b15611431578373ffffffffffffffffffffffffffffffffffffffff1663f23a6e6187878686866040518663ffffffff1660e01b81526004016112b7959493929190611c09565b602060405180830381600087803b1580156112d157600080fd5b505af192505050801561130257506040513d601f19601f820116820180604052508101906112ff91906118f0565b60015b6113a85761130e6121c1565b806308c379a0141561136b57506113236124c8565b8061132e575061136d565b806040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016113629190611cd7565b60405180910390fd5b505b6040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161139f90611df9565b60405180910390fd5b63f23a6e6160e01b7bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916817bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19161461142f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161142690611cf9565b60405180910390fd5b505b505050505050565b6000808273ffffffffffffffffffffffffffffffffffffffff163b119050919050565b600061146f61146a84611e82565b611e5d565b9050808382526020820190508285602086028201111561148e57600080fd5b60005b858110156114be57816114a48882611572565b845260208401935060208301925050600181019050611491565b5050509392505050565b60006114db6114d684611eae565b611e5d565b905080838252602082019050828560208602820111156114fa57600080fd5b60005b8581101561152a57816115108882611644565b8452602084019350602083019250506001810190506114fd565b5050509392505050565b600061154761154284611eda565b611e5d565b90508281526020810184848401111561155f57600080fd5b61156a848285612046565b509392505050565b6000813590506115818161255e565b92915050565b600082601f83011261159857600080fd5b81356115a884826020860161145c565b91505092915050565b600082601f8301126115c257600080fd5b81356115d28482602086016114c8565b91505092915050565b6000813590506115ea81612575565b92915050565b6000813590506115ff8161258c565b92915050565b6000815190506116148161258c565b92915050565b600082601f83011261162b57600080fd5b813561163b848260208601611534565b91505092915050565b600081359050611653816125a3565b92915050565b6000806040838503121561166c57600080fd5b600061167a85828601611572565b925050602061168b85828601611572565b9150509250929050565b600080600080600060a086880312156116ad57600080fd5b60006116bb88828901611572565b95505060206116cc88828901611572565b945050604086013567ffffffffffffffff8111156116e957600080fd5b6116f5888289016115b1565b935050606086013567ffffffffffffffff81111561171257600080fd5b61171e888289016115b1565b925050608086013567ffffffffffffffff81111561173b57600080fd5b6117478882890161161a565b9150509295509295909350565b600080600080600060a0868803121561176c57600080fd5b600061177a88828901611572565b955050602061178b88828901611572565b945050604061179c88828901611644565b93505060606117ad88828901611644565b925050608086013567ffffffffffffffff8111156117ca57600080fd5b6117d68882890161161a565b9150509295509295909350565b600080604083850312156117f657600080fd5b600061180485828601611572565b9250506020611815858286016115db565b9150509250929050565b6000806040838503121561183257600080fd5b600061184085828601611572565b925050602061185185828601611644565b9150509250929050565b6000806040838503121561186e57600080fd5b600083013567ffffffffffffffff81111561188857600080fd5b61189485828601611587565b925050602083013567ffffffffffffffff8111156118b157600080fd5b6118bd858286016115b1565b9150509250929050565b6000602082840312156118d957600080fd5b60006118e7848285016115f0565b91505092915050565b60006020828403121561190257600080fd5b600061191084828501611605565b91505092915050565b60006020828403121561192b57600080fd5b600061193984828501611644565b91505092915050565b600061194e8383611b83565b60208301905092915050565b61196381611fd2565b82525050565b600061197482611f1b565b61197e8185611f49565b935061198983611f0b565b8060005b838110156119ba5781516119a18882611942565b97506119ac83611f3c565b92505060018101905061198d565b5085935050505092915050565b6119d081611fe4565b82525050565b60006119e182611f26565b6119eb8185611f5a565b93506119fb818560208601612055565b611a04816121e3565b840191505092915050565b6000611a1a82611f31565b611a248185611f6b565b9350611a34818560208601612055565b611a3d816121e3565b840191505092915050565b6000611a55602883611f6b565b9150611a6082612201565b604082019050919050565b6000611a78602a83611f6b565b9150611a8382612250565b604082019050919050565b6000611a9b602e83611f6b565b9150611aa68261229f565b604082019050919050565b6000611abe602583611f6b565b9150611ac9826122ee565b604082019050919050565b6000611ae1602a83611f6b565b9150611aec8261233d565b604082019050919050565b6000611b04602983611f6b565b9150611b0f8261238c565b604082019050919050565b6000611b27602983611f6b565b9150611b32826123db565b604082019050919050565b6000611b4a602883611f6b565b9150611b558261242a565b604082019050919050565b6000611b6d603483611f6b565b9150611b7882612479565b604082019050919050565b611b8c8161203c565b82525050565b611b9b8161203c565b82525050565b600060a082019050611bb6600083018861195a565b611bc3602083018761195a565b8181036040830152611bd58186611969565b90508181036060830152611be98185611969565b90508181036080830152611bfd81846119d6565b90509695505050505050565b600060a082019050611c1e600083018861195a565b611c2b602083018761195a565b611c386040830186611b92565b611c456060830185611b92565b8181036080830152611c5781846119d6565b90509695505050505050565b60006020820190508181036000830152611c7d8184611969565b905092915050565b60006040820190508181036000830152611c9f8185611969565b90508181036020830152611cb38184611969565b90509392505050565b6000602082019050611cd160008301846119c7565b92915050565b60006020820190508181036000830152611cf18184611a0f565b905092915050565b60006020820190508181036000830152611d1281611a48565b9050919050565b60006020820190508181036000830152611d3281611a6b565b9050919050565b60006020820190508181036000830152611d5281611a8e565b9050919050565b60006020820190508181036000830152611d7281611ab1565b9050919050565b60006020820190508181036000830152611d9281611ad4565b9050919050565b60006020820190508181036000830152611db281611af7565b9050919050565b60006020820190508181036000830152611dd281611b1a565b9050919050565b60006020820190508181036000830152611df281611b3d565b9050919050565b60006020820190508181036000830152611e1281611b60565b9050919050565b6000602082019050611e2e6000830184611b92565b92915050565b6000604082019050611e496000830185611b92565b611e566020830184611b92565b9392505050565b6000611e67611e78565b9050611e7382826120ba565b919050565b6000604051905090565b600067ffffffffffffffff821115611e9d57611e9c612192565b5b602082029050602081019050919050565b600067ffffffffffffffff821115611ec957611ec8612192565b5b602082029050602081019050919050565b600067ffffffffffffffff821115611ef557611ef4612192565b5b611efe826121e3565b9050602081019050919050565b6000819050602082019050919050565b600081519050919050565b600081519050919050565b600081519050919050565b6000602082019050919050565b600082825260208201905092915050565b600082825260208201905092915050565b600082825260208201905092915050565b6000611f878261203c565b9150611f928361203c565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611fc757611fc6612134565b5b828201905092915050565b6000611fdd8261201c565b9050919050565b60008115159050919050565b60007fffffffff0000000000000000000000000000000000000000000000000000000082169050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b82818337600083830152505050565b60005b83811015612073578082015181840152602081019050612058565b83811115612082576000848401525b50505050565b600060028204905060018216806120a057607f821691505b602082108114156120b4576120b3612163565b5b50919050565b6120c3826121e3565b810181811067ffffffffffffffff821117156120e2576120e1612192565b5b80604052505050565b60006120f68261203c565b91507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82141561212957612128612134565b5b600182019050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b600060033d11156121e05760046000803e6121dd6000516121f4565b90505b90565b6000601f19601f8301169050919050565b60008160e01c9050919050565b7f455243313135353a204552433131353552656365697665722072656a6563746560008201527f6420746f6b656e73000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2061646472657373207a65726f206973206e6f742061207660008201527f616c6964206f776e657200000000000000000000000000000000000000000000602082015250565b7f455243313135353a2063616c6c6572206973206e6f7420746f6b656e206f776e60008201527f6572206f7220617070726f766564000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e7366657220746f20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a20696e73756666696369656e742062616c616e636520666f60008201527f72207472616e7366657200000000000000000000000000000000000000000000602082015250565b7f455243313135353a2073657474696e6720617070726f76616c2073746174757360008201527f20666f722073656c660000000000000000000000000000000000000000000000602082015250565b7f455243313135353a206163636f756e747320616e6420696473206c656e67746860008201527f206d69736d617463680000000000000000000000000000000000000000000000602082015250565b7f455243313135353a2069647320616e6420616d6f756e7473206c656e6774682060008201527f6d69736d61746368000000000000000000000000000000000000000000000000602082015250565b7f455243313135353a207472616e7366657220746f206e6f6e2d4552433131353560008201527f526563656976657220696d706c656d656e746572000000000000000000000000602082015250565b600060443d10156124d85761255b565b6124e0611e78565b60043d036004823e80513d602482011167ffffffffffffffff8211171561250857505061255b565b808201805167ffffffffffffffff811115612526575050505061255b565b80602083010160043d03850181111561254357505050505061255b565b612552826020018501866120ba565b82955050505050505b90565b61256781611fd2565b811461257257600080fd5b50565b61257e81611fe4565b811461258957600080fd5b50565b61259581611ff0565b81146125a057600080fd5b50565b6125ac8161203c565b81146125b757600080fd5b5056fea26469706673582212203c0d02283efe2c29ccd804fdf6ec398f0eb06d53406933921734b724a51ef34264736f6c63430008040033";

type ERC1155ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ERC1155ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ERC1155__factory extends ContractFactory {
  constructor(...args: ERC1155ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    uri_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<ERC1155> {
    return super.deploy(uri_, overrides || {}) as Promise<ERC1155>;
  }
  override getDeployTransaction(
    uri_: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(uri_, overrides || {});
  }
  override attach(address: string): ERC1155 {
    return super.attach(address) as ERC1155;
  }
  override connect(signer: Signer): ERC1155__factory {
    return super.connect(signer) as ERC1155__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC1155Interface {
    return new utils.Interface(_abi) as ERC1155Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC1155 {
    return new Contract(address, _abi, signerOrProvider) as ERC1155;
  }
}
