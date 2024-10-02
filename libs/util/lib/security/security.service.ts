import { LogService, Service, Use } from "@core/server";
import { aesDecrypt, aesEncrypt, getSignature, jwtSign, jwtVerify } from "@util/nest";
import { baseEnv } from "@core/base";
import { cnst } from "../cnst";
import { verifyToken } from "@core/nest";
import type { Account, DocumentModel, Me, MyKeyring, ProtoFile, Self, Signature } from "@core/base";

@Service("SecurityService")
export class SecurityService extends LogService("SecurityService") {
  @Use() protected jwtSecret: string;
  @Use() protected aeskey: string;
  @Use() protected onCleanup?: () => Promise<void>;

  decrypt(hash: string) {
    return aesDecrypt(hash, this.aeskey);
  }
  encrypt(data: string) {
    return aesEncrypt(data, this.aeskey);
  }
  sign(message: string | Record<string, any>) {
    return jwtSign(message, this.jwtSecret);
  }
  verify(token: string) {
    return jwtVerify(token, this.jwtSecret);
  }
  updateSignature(walletSign: cnst.WalletSign, account?: Account) {
    const signature = getSignature(walletSign, this.aeskey);
    if (!signature) throw new Error("Invalid Signature");
    return this.generateJwt({ signature, account });
  }
  generateJwt({
    keyring,
    user,
    image,
    admin,
    account,
    signature,
  }: {
    keyring?: cnst.ProtoKeyring | MyKeyring;
    user?: cnst.ProtoUser | Self;
    image?: DocumentModel<ProtoFile> | null;
    admin?: cnst.ProtoAdmin | Me;
    signature?: Signature | null;
    account?: Account;
  }): { jwt: string } {
    return {
      jwt: jwtSign(
        {
          ...(account ?? {}),
          ...(user
            ? {
                self: {
                  id: user.id,
                  nickname: user.nickname ?? "",
                  roles: user.roles,
                  requestRoles: user.requestRoles,
                  image: image
                    ? { url: image.url, imageSize: image.imageSize }
                    : typeof user.image === "object"
                      ? user.image
                      : null,
                  profileStatus: user.profileStatus,
                  status: user.status,
                },
              }
            : {}),
          ...(keyring
            ? {
                myKeyring: {
                  id: keyring.id,
                  accountId: keyring.accountId,
                  chainWallets: keyring.chainWallets.map(({ network, address }) => ({ network, address })),
                  status: keyring.status,
                },
              }
            : {}),
          ...(admin
            ? {
                me: {
                  id: admin.id,
                  accountId: admin.accountId,
                  roles: admin.roles,
                  status: admin.status,
                },
              }
            : {}),
          ...(signature ? { signature } : {}),
          appName: baseEnv.appName,
          environment: baseEnv.environment,
        },
        this.jwtSecret
      ),
    };
  }
  verifyToken(token?: string) {
    return verifyToken(this.jwtSecret, token);
  }
  async cleanup() {
    if (!this.onCleanup) throw new Error("onCleanup is not defined");
    await this.onCleanup();
  }
}
