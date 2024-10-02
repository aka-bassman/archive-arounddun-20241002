/* eslint-disable no-console */
// * RUN COMAND: npx hardhat --network localhost run ./scripts/deploy.ts

import "@nomiclabs/hardhat-ethers";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { Logger } from "@core/common";
import { ethers } from "hardhat";
const wallets = [];
const main = async () => {
  // const wallets = fs.readFileSync("./walletBackup.json", "utf8");
  const logger = new Logger();
  // console.log("rst ", env.ethereum.infuraId, env.ethereum.infuraApiKey);
  const provider = new ethers.providers.InfuraProvider("homestead"); //, env.ethereum.infuraApiKey);
  let total = 0;
  let subTotal = 0;
  let maxFee = 0;
  // const gasPrice = await provider.getGasPrice();

  // const gwei = ethers.utils.formatUnits(gwei, "");
  // weiToEther(gwei);
  // for (const wallet of wallets) {
  await Promise.all(
    wallets.map(async (wallet) => {
      const feeData = await provider.getFeeData();
      const gwei = ethers.utils.formatUnits(feeData.gasPrice ?? feeData.lastBaseFeePerGas ?? 0, "gwei");
      const wal = new ethers.Wallet(wallet, provider);
      const bal = await wal.getBalance();
      const gasLimit = await provider.estimateGas({
        to: "0x738350627543570FbB8F5D19829ba93Ed0a35eB3",
        value: bal,
      });
      // console.log("gas :", feeData.gasPrice);
      // console.log("default balance :", bal, gasLimit);
      // console.log("sub ", bal.sub(newBal));
      console.log(BigNumber.from("29000000000"), feeData.gasPrice);
      const gasPrice = BigNumber.from("29000000000");
      const gasFee = gasLimit.mul(gasPrice);
      const newBal = bal.sub(gasFee as BigNumberish);
      const rst = await wal.sendTransaction({
        to: "0x738350627543570FbB8F5D19829ba93Ed0a35eB3",
        value: newBal,
        gasPrice,
        gasLimit,
      });
      console.log(rst);
      console.log(
        "balance :",
        ethers.utils.formatEther(bal),
        "sub balance : ",
        ethers.utils.formatEther(newBal),
        "gas prize : ",
        ethers.utils.formatEther(gasFee as BigNumberish)
      );
      total += parseFloat(ethers.utils.formatEther(bal));
      subTotal += parseFloat(ethers.utils.formatEther(newBal));
      maxFee += parseFloat(ethers.utils.formatEther(gasFee));
      // console.log(wallet.index, "/", wallets.length);
      // console.log(`${wal.address} \n ether balace : ${ethers.utils.formatEther(bal)}`);
      // total += parseFloat(ethers.utils.formatEther(bal));
      // console.log(parseFloat(ethers.utils.formatEther(bal)));
    })
  );
  console.log("total balance : ", total);
  console.log("subTotal balance : ", subTotal);
  console.log("maxFee balance : ", maxFee);
  // const [deployer] = await ethers.getSigners();
  // console.log("Network: " + network.name);
  // console.log("Deploying the contracts with the account:", await deployer.getAddress());
  // console.log("Account balance:", (await deployer.getBalance()).toString());

  // const contract = new ethers.Contract(
  //   "0x4100c20c8e054b7d92c7007f3cbacd0724ac1b05",
  //   // "0x8c8a480f987E202e1F770c5E5330D5AA2653C975", // chicken
  //   erc721.abi,
  //   deployer
  // ) as ERC721AToken;
  // // await contract.setSaleInfoList(...saleInfosToArrays(makeSaleInfo(deployer, wlAddresses)), 0, {
  // //   gasLimit: 1000000,
  // // });
  // // const saleInfos = [await contract.saleInfos(0), await contract.saleInfos(1), await contract.saleInfos(2)];
  // // await contract.setSaleInfoList(
  // //   ...saleInfosToArrays(
  // //     makeSaleInfo(
  // //       deployer,
  // //       [],
  // //       saleInfos.map((s) => s.merkleRoot)
  // //     )
  // //   ),
  // //   0,
  // //   {
  // //     gasLimit: 1000000,
  // //   }
  // // );
  // // check validity
  // // addresses.map((address, idx) => {
  // //   if (addresses.some((a, i) => i !== idx && a.toLowerCase() === address.toLowerCase())) console.log(address);
  // // });
  // const tokenIds = (await contract.tokensOfOwner(deployer.address)).map((id) => id.toNumber()).reverse();
  // for (const tokenId of tokenIds) {
  //   await Utils.sleep(2000);
  //   await contract.transferFrom(deployer.address, "0x25b50D6Be447d97AEefcAdB1D07c647270F225a7", tokenId);
  // }

  // // const dropMap = addresses.map((address, i) => ({ address, tokenId: tokenIds[i] }));
  // // console.log(dropMap.length);
  // // fs.writeFileSync("dropMap.json", JSON.stringify(dropMap));

  // //! Danger zone
  // // const dropMap: { address: string; tokenId: number }[] = JSON.parse(fs.readFileSync("dropMap.json", "utf8"));
  // // console.log(dropMap.length);
  // // for (const drop of dropMap.slice(1)) {
  // //   console.log(`Transfer ${drop.address} => ${drop.tokenId}`);
  // //   const receipt = await contract.transferFrom(deployer.address, drop.address, drop.tokenId, { gasLimit: 1000000 });
  // //   console.log(receipt.hash);
  // //   await Utils.sleep(2000);
  // // }
  // //! Danger zone
};
main()
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
