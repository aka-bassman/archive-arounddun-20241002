/* eslint-disable @nx/workspace/noImportExternalLibrary */
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import * as chai from "chai";
import { type ERC721AToken } from "../typechain-types";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { getMerkleProof, getMerkleTree } from "@contract/utils";
import dayjs from "dayjs";
const should = chai.should();
const expect = chai.expect;

describe("ERC721A", function () {
  let contract1: ERC721AToken, contract2: ERC721AToken, contract3: ERC721AToken, contract4: ERC721AToken;
  let root: SignerWithAddress;
  let user1: SignerWithAddress, user2: SignerWithAddress;
  it("should deploy two contracts", async function () {
    [root, user1, user2] = await ethers.getSigners();
    const factory = await ethers.getContractFactory("ERC721AToken");
    contract1 = await factory.connect(root).deploy("ContractName1", "CN1", 10000, "", true);
    contract2 = await factory.connect(root).deploy("ContractName2", "CN2", 10000, "", true);
  });
  it("set sale info only for root", async function () {
    const merkleTree = getMerkleTree([root.address]);
    await contract1.setSaleInfoList(
      [10000],
      [0],
      [dayjs().unix()],
      [dayjs().add(1000, "year").unix()],
      [merkleTree.root],
      [10000],
      [10000],
      [10000],
      [0]
    );
  });
  it("cannot be minted by user", async function () {
    const proof = getMerkleProof([user1.address], user1.address);
    await expect(contract1.connect(user1).mint(0, 1, proof)).to.be.reverted;
  });
  it("can be minted until 5000", async function () {
    const proof = getMerkleProof([root.address], root.address);
    const tx = await contract1.connect(root).mint(0, 5000, proof);
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
    const totalSupply = await contract1.totalSupply();
    totalSupply.should.equal(5000);
  });
  it("can be transferred to another address", async function () {
    const tx1 = await contract1.connect(root).transferFrom(root.address, user1.address, 1);
    const receipt = await tx1.wait();
    expect(receipt.status).to.be.equal(1);
    const ownerOf = await contract1.ownerOf(1);
    ownerOf.should.equal(user1.address);

    const tx2 = await contract1.connect(root).transferFrom(root.address, user2.address, 2);
    const receipt2 = await tx2.wait();
    expect(receipt2.status).to.be.equal(1);
    const ownerOf2 = await contract1.ownerOf(2);
    ownerOf2.should.equal(user2.address);
  });
  it("should not mint when supply is exceeded", async function () {
    const proof = getMerkleProof([root.address], root.address);
    await expect(contract1.connect(root).mint(0, 5001, proof)).to.be.reverted;
  });
  it("should mint 10000 of contract1", async function () {
    const proof = getMerkleProof([root.address], root.address);
    const tx = await contract1.connect(root).mint(0, 5000, proof);
    const receipt = await tx.wait();
    expect(receipt.status).to.be.equal(1);
    const totalSupply = await contract1.totalSupply();
    totalSupply.should.equal(10000);
  });
  it("should transfer to another user", async function () {
    const tx1 = await contract1.connect(root).transferFrom(root.address, user1.address, 3);
    const receipt = await tx1.wait();
    expect(receipt.status).to.be.equal(1);
    const ownerOf = await contract1.ownerOf(3);
    ownerOf.should.equal(user1.address);
  });
  it("deploy new contract should start from 0", async function () {
    const factory = await ethers.getContractFactory("ERC721AToken");
    contract3 = await factory.connect(root).deploy("ContractName3", "CN3", 10000, "", true);
    const merkleTree = getMerkleTree([root.address]);
    await contract3.setSaleInfoList(
      [10000],
      [0],
      [dayjs().unix()],
      [dayjs().add(1000, "year").unix()],
      [merkleTree.root],
      [10000],
      [10000],
      [10000],
      [0]
    );
  });
  it("should mint 10000 of contract3", async function () {
    const proof = getMerkleProof([root.address], root.address);
    const tx1 = await contract3.connect(root).mint(0, 5000, proof);
    const receipt1 = await tx1.wait();
    expect(receipt1.status).to.be.equal(1);
    const tx2 = await contract3.connect(root).mint(0, 5000, proof);
    const receipt2 = await tx2.wait();
    expect(receipt2.status).to.be.equal(1);

    const totalSupply = await contract3.totalSupply();
    totalSupply.should.equal(10000);
  });
  it("can be transferred to another user", async function () {
    const tx1 = await contract3.connect(root).transferFrom(root.address, user1.address, 1);
    const receipt = await tx1.wait();
    expect(receipt.status).to.be.equal(1);
    const ownerOf = await contract3.ownerOf(1);
    ownerOf.should.equal(user1.address);
  });
});
