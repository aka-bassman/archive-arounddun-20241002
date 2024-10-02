// /* eslint-disable @nx/workspace/noImportExternalLibrary */
// import "@nomicfoundation/hardhat-toolbox";
// import "@nomiclabs/hardhat-ethers";
// import * as chai from "chai";
// import { ContractReceipt, ContractTransaction } from "@ethersproject/contracts";
// import { ERC20Migratable } from "../typechain-types";
// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { ethers } from "hardhat";
// const should = chai.should();
// const expect = chai.expect;
// // import { HardhatUserConfig, task } from "hardhat/config";
// const etherToWei = (number: number) => {
//   return (number * Math.pow(10, 18)).toString();
// };
// describe("Akamir Collection test", function () {
//   let contract: ERC20Migratable;
//   let root: SignerWithAddress;
//   let registrar: SignerWithAddress;
//   let user: SignerWithAddress;
//   let foreigner: SignerWithAddress;

//   before(async function () {
//     [root, registrar, user, foreigner] = await ethers.getSigners();
//     const factory = await ethers.getContractFactory("ERC20Migratable");
//     contract = await factory.connect(root).deploy("TestMigratable", "TMG");
//     await contract.deployed();
//     // expect(await contract.deployed()).not.be.undefined;
//   });

//   context("Deposit", function () {
//     let tx: ContractTransaction;
//     let receipt: ContractReceipt;
//     it("Initial Setup Supply", async function () {
//       await contract.setSupply(ethers.utils.parseEther("100").toString());
//       expect((await contract.maxSupply()).eq(ethers.utils.parseEther("100"))).to.be.true;
//       expect((await contract.accumulatedDeposit()).eq(ethers.utils.parseEther("0"))).to.be.true;
//       expect((await contract.accumulatedWithdraw()).eq(ethers.utils.parseEther("0"))).to.be.true;
//       expect((await contract.supplyable()).eq(ethers.utils.parseEther("100"))).to.be.true;
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("100"))).to.be.true;
//       const initHash = ethers.utils.formatBytes32String("init");
//       await contract.grantRole(await contract.REGISTRAR_ROLE(), registrar.address);
//       await contract
//         .connect(registrar)
//         .registerWithdrawal(user.address, initHash, ethers.utils.parseEther("10").toString());
//       await contract
//         .connect(registrar)
//         .registerWithdrawal(foreigner.address, initHash, ethers.utils.parseEther("20").toString());
//       expect(await contract.withdrawMap(user.address, initHash)).to.be.equal(ethers.utils.parseEther("10").toString());
//       expect(await contract.withdrawMap(foreigner.address, initHash)).to.be.equal(
//         ethers.utils.parseEther("20").toString()
//       );
//       await contract.connect(user).withdraw(initHash, ethers.utils.parseEther("10").toString());
//       await contract.connect(foreigner).withdraw(initHash, ethers.utils.parseEther("20").toString());
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("70"))).to.be.true;
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("10"))).to.be.true;
//       expect((await contract.balanceOf(foreigner.address)).eq(ethers.utils.parseEther("20"))).to.be.true;
//     });
//     // Operator 지정
//     // Pause시 Deposit, Withdraw 불가
//     // Unpause시 Deposit, Withdraw 가능
//     it("Only Root Should Setup Supply", async function () {
//       await expect(contract.connect(user).setSupply(ethers.utils.parseEther("1000").toString())).to.be.reverted;
//       await expect(contract.connect(foreigner).setSupply(ethers.utils.parseEther("100").toString())).to.be.reverted;
//     });
//     it("Should be Fail if burn amount is over the balance", async function () {
//       await expect(contract.setSupply(ethers.utils.parseEther("90").toString())).not.to.be.reverted;
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("60"))).to.be.true;
//       await expect(contract.setSupply(ethers.utils.parseEther("10").toString())).to.be.reverted;
//     });
//     it("Should be Fail if withdraw registration is over the balance", async function () {
//       await expect(
//         contract
//           .connect(registrar)
//           .registerWithdrawal(
//             user.address,
//             ethers.utils.formatBytes32String("init"),
//             ethers.utils.parseEther("1000").toString()
//           )
//       ).to.be.reverted;
//     });
//     it("Deposit and Transfer Successfully", async function () {
//       tx = await contract.connect(user).deposit(ethers.utils.parseEther("5").toString());
//       receipt = await tx.wait();
//       expect(await contract.balanceOf(user.address)).to.be.eq(ethers.utils.parseEther("5"));
//     });
//     it("Server Deposit Check Successfully", async function () {
//       expect(await contract.depositMap(user.address, receipt.blockNumber)).to.be.eq(ethers.utils.parseEther("5"));
//       expect(await contract.balanceOf(contract.address)).to.be.eq(ethers.utils.parseEther("65"));
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("5"))).to.be.true;
//     });
//     it("Should Fail to Register with Non-Root", async function () {
//       await expect(contract.connect(foreigner).setSupply(ethers.utils.parseEther("1000").toString())).to.be.reverted;
//       await expect(
//         contract
//           .connect(foreigner)
//           .registerWithdrawal(user.address, ethers.utils.formatBytes32String("init"), ethers.utils.parseEther("5"))
//       ).to.be.reverted;
//     });
//     it("Server Withdrawal Registration Successfully", async function () {
//       await contract
//         .connect(registrar)
//         .registerWithdrawal(user.address, receipt.transactionHash, ethers.utils.parseEther("5"));
//       expect((await contract.withdrawMap(user.address, receipt.transactionHash)).eq(ethers.utils.parseEther("5"))).to.be
//         .true;
//     });
//     it("Should Fail Server Withdrawal with Duplicated Deposit", async function () {
//       await expect(
//         contract
//           .connect(registrar)
//           .registerWithdrawal(user.address, receipt.transactionHash, ethers.utils.parseEther("5"))
//       ).to.be.reverted;
//     });
//     it("Cannot Withdraw Without the Registered Address", async function () {
//       await expect(contract.connect(foreigner).withdraw(receipt.transactionHash, ethers.utils.parseEther("5"))).to.be
//         .reverted;
//     });
//     it("Cannot Withdraw Without the Same Amount", async function () {
//       await expect(contract.connect(user).withdraw(receipt.transactionHash, ethers.utils.parseEther("10"))).to.be
//         .reverted;
//       await expect(contract.connect(user).withdraw(receipt.transactionHash, ethers.utils.parseEther("1"))).to.be
//         .reverted;
//     });
//     it("Withdraw Successfully with Same Amount and Registered Address", async function () {
//       let withdrawListened = false;
//       const handleWithdrawal = (to, txHash: string, value, event) => {
//         if (receipt.transactionHash.toString().toLowerCase() === txHash.toString().toLowerCase())
//           withdrawListened = true;
//       };
//       const wait = async () => {
//         return new Promise((resolve) => {
//           setTimeout(() => {
//             resolve(true);
//           }, 5000);
//         });
//       };
//       contract.connect(user).on("Withdraw", handleWithdrawal);
//       await contract.connect(user).withdraw(receipt.transactionHash, ethers.utils.parseEther("5"));
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("10"))).to.be.true;
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("60"))).to.be.true;
//       expect((await contract.withdrawMap(user.address, receipt.transactionHash)).eq(1)).to.be.true;
//       await wait();
//       expect(withdrawListened).to.be.true;
//       contract.off("Withdraw", handleWithdrawal);
//     });
//     it("Cannot Withdraw Twice", async function () {
//       await expect(contract.connect(user).withdraw(receipt.transactionHash, ethers.utils.parseEther("5"))).to.be
//         .reverted;
//     });
//     it("Second Deposit and Transfer Successfully", async function () {
//       tx = await contract.connect(user).deposit(ethers.utils.parseEther("1").toString());
//       receipt = await tx.wait();
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("9"))).to.be.true;
//     });
//     it("Second Server Deposit Check Successfully", async function () {
//       expect((await contract.depositMap(user.address, receipt.blockNumber)).eq(ethers.utils.parseEther("1"))).to.be
//         .true;
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("61"))).to.be.true;
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("9"))).to.be.true;
//     });
//     it("Second Server Withdrawal Registration Successfully", async function () {
//       await contract
//         .connect(registrar)
//         .registerWithdrawal(user.address, receipt.transactionHash, ethers.utils.parseEther("1"));
//       expect((await contract.withdrawMap(user.address, receipt.transactionHash)).eq(ethers.utils.parseEther("1"))).to.be
//         .true;
//     });
//     it("Second Withdraw Successfully", async function () {
//       await contract.connect(user).withdraw(receipt.transactionHash, ethers.utils.parseEther("1"));
//       expect((await contract.balanceOf(user.address)).eq(ethers.utils.parseEther("10"))).to.be.true;
//       expect((await contract.withdrawMap(user.address, receipt.transactionHash)).eq(1)).to.be.true;
//       expect((await contract.maxSupply()).eq(ethers.utils.parseEther("90"))).to.be.true;
//       expect((await contract.accumulatedDeposit()).eq(ethers.utils.parseEther("6"))).to.be.true;
//       expect((await contract.accumulatedWithdraw()).eq(ethers.utils.parseEther("36"))).to.be.true;
//       expect((await contract.supplyable()).eq(ethers.utils.parseEther("60"))).to.be.true;
//       expect((await contract.balanceOf(contract.address)).eq(ethers.utils.parseEther("60"))).to.be.true;
//     });
//   });
// });
