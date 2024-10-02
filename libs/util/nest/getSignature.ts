import { type Signature, dayjs } from "@core/base";
import { aesDecrypt } from "./aesDecrypt";
import { arrayify } from "@ethersproject/bytes";
import { hashMessage } from "@ethersproject/hash";
import { recoverAddress } from "@ethersproject/transactions";
import type { cnst } from "../lib/cnst";
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const Caver = require("caver-js");

const parseSignMessage = (message: string) => {
  const timeString = "timeStamp:";
  const startIdx = message.indexOf("[") + 1;
  const endIdx = message.indexOf("]");
  const timeIndex = message.indexOf(timeString) + timeString.length;
  const hash = message.slice(startIdx, endIdx);
  const timeStamp = parseInt(message.slice(timeIndex, message.length));
  return { hash, timeStamp };
};
export const getSignature = (
  { signchain, signmessage, signaddress }: { signchain: string; signmessage: string; signaddress: string },
  aeskey: string
): Signature | null => {
  try {
    const { hash, timeStamp } = parseSignMessage(signmessage);
    if (-dayjs(timeStamp).diff() / 1000 / 60 > 10) return null;
    const address = aesDecrypt(hash, aeskey).toLowerCase();
    const msgHash = hashMessage(signmessage);
    const msgHashBytes = arrayify(msgHash);
    const provider: cnst.ChainProvider = ["1001", "8217"].includes(signchain) ? "klaytn" : "ethereum";
    const network: cnst.ChainNetwork | null =
      signchain === "1001"
        ? "klaytn-baobab"
        : signchain === "8217"
          ? "klaytn-cypress"
          : signchain === "11155111"
            ? "ethereum-sepolia"
            : signchain === "1"
              ? "ethereum-mainnet"
              : null;
    if (!network) throw new Error("Unknown Network");
    const recoveredAddress = recoverAddress(msgHashBytes, signaddress).toLowerCase();
    // provider === "klaytn"
    //   ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //     (new Caver().klay.accounts.recover(signmessage, signaddress).toLowerCase() as string)
    //   : recoverAddress(msgHashBytes, signaddress).toLowerCase();
    if (address !== recoveredAddress) return null;
    return { __InternalArg__: "Signature", network, provider, address, expireAt: dayjs().add(10, "minute") };
  } catch (err) {
    throw new Error(err as string);
  }
};
