/* eslint-disable no-console */
// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, network } from "hardhat";

const CONTRACT_NAME = "AkaToken";
const ARGS = ["AkaCoin", "AKA"];

const main = async () => {
  const [deployer] = await ethers.getSigners();
  console.log("Network: " + network.name);
  console.log("Deploying the contracts with the account:", await deployer.getAddress());
  console.log("Account balance:", (await deployer.getBalance()).toString());
  await Promise.all([
    // await deployErc20Migratable(deployer),
    // await deployErc20(deployer),
    await deployErc721(deployer),
    // await deployErc1155(deployer),
    // await deployMulticall(),
    // await deployMarket(),
  ]);

  // const marketAddress = "0xe2AB819885E2d5A6691aBA9145E03724578b9995";
  // const contract = new Contract(marketAddress, market.abi, deployer) as AkaMarket;
  // console.log(await contract.addOperators([deployer.address]));
};
const deployErc20Migratable = async (deployer: SignerWithAddress) => {
  const name = "ERC20Migratable";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy("Moc test", "MCT");
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployErc20 = async (deployer: SignerWithAddress) => {
  const name = "AkaToken";
  const factory = await ethers.getContractFactory(name);

  const contract = await factory.deploy("AkaCoin", "AKA");
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployErc721 = async (deployer: SignerWithAddress) => {
  const name = "ERC721AToken";
  const factory = await ethers.getContractFactory(name);
  const contract = factory.attach("0x808370dC20c081815497f500d03Bc94b93dfdDf0");
  // const contract = await factory.deploy(
  //   "Pyeonchang Olympia Collection Test",
  //   "POC",
  //   10000,
  //   "https://pyeonchang-develop.akamir.com/generative/opensea/66ee7b5c5724e841dda11872/",
  //   true
  // );
  // await contract.deployed();

  // await contract.connect(deployer).setSaleInfoList(
  //   [10000],
  //   [0],
  //   [dayjs().unix()],
  //   [dayjs().add(1000, "year").unix()],
  //   [getMerkleTree([deployer.address]).root],
  //   [10000],
  //   [10000],
  //   [10000],
  //   [0]
  //   // { gasLimit: 200000 }
  // );
  // await contract.connect(deployer).mint(0, 5000, getMerkleProof([deployer.address], deployer.address), {
  //   gasLimit: 200000000,
  // });
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  // await contract
  //   .connect(deployer)
  //   .setMetadata("https://pyeonchang-develop.akamir.com/generative/opensea/66ee7af75724e841dda11811/", "", true);
  console.log(await contract.contractURI(), await contract.tokenURI(1));
  return contract;
};
const deployErc1155 = async (deployer: SignerWithAddress) => {
  const name = "Collection";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  await contract.connect(deployer).addCollection(0, 1000, 1, "asdf");
  await contract.connect(deployer).mintSelf(0, 100, { gasLimit: 200000 });
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployMulticall = async () => {
  const name = "Multicall";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployMarket = async () => {
  const name = "AkaMarket";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
const deployTether = async () => {
  const name = "TetherToken";
  const factory = await ethers.getContractFactory(name);
  const contract = await factory.deploy();
  await contract.deployed();
  console.log(`${name} Deployed Contract Address: ${contract.address}`);
  return contract;
};
main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error as string);
    process.exit(1);
  });
