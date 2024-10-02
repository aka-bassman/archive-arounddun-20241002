import type { ChainNetwork } from "../_util/util.constant";

export interface ProtoWallet {
  network: ChainNetwork;
  address: string;
}
export interface ProtoKeyring {
  id: string;
  accountId?: string;
  chainWallets: ProtoWallet[];
  status: string;
}
export interface ProtoAdmin {
  id: string;
  accountId: string;
  roles: string[];
  status: string;
}
export interface ProtoUser {
  id: string;
  nickname?: string;
  roles: string[];
  requestRoles: string[];
  image?: string;
  status: string;
  profileStatus: string;
}

export interface WalletSign {
  signchain: string;
  signmessage: string;
  signaddress: string; // | string[];
}
