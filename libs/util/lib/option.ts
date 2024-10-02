import type { BaseEnv } from "@core/base";
import type {
  CloudflareOptions,
  DiscordOptions,
  FirebaseOptions,
  GmailOptions,
  IpfsOptions,
  ObjectStorageOptions,
  PurpleOptions,
} from "../nest";

export interface RedisOptions {
  username?: string;
  password?: string;
}
export interface Wallet {
  address: string;
  privateKey: string;
}

export const ssoTypes = ["github", "google", "facebook", "apple", "naver", "kakao"] as const;
export type SSOType = (typeof ssoTypes)[number];
export interface SSOCredential {
  clientID: string;
  clientSecret?: string; //apple의 경우 keypath
}
export type AppleCredential = SSOCredential & {
  teamID: string;
  keyID: string;
  keyFilePath: string;
};
export type SSOOptions = {
  [key in SSOType]?: SSOCredential | AppleCredential;
};

export interface SecurityOptions {
  verifies: ("wallet" | "password" | "phone" | "kakao" | "naver" | "email")[][];
  sso: SSOOptions;
}

export interface MongoOptions {
  password?: string;
  replSet?: string;
}
export interface GoogleAccount {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

export interface ModulesOptions extends BaseEnv {
  appCode: number;
  hostname: string | null;
  redis: RedisOptions;
  mongo: MongoOptions;
  security: SecurityOptions;
  objectStorage: ObjectStorageOptions;
  ipfs: IpfsOptions;
  discord: DiscordOptions;
  mailer: GmailOptions;
  message: PurpleOptions;
  cloudflare: CloudflareOptions;
  firebase: FirebaseOptions;
  iapVerify: {
    google: GoogleAccount;
    apple: string;
  };
}
