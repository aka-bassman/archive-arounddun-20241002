import { Database, Document, Input, Loader, Middleware, Model, type SchemaOf } from "@core/server";
import { Revert } from "../dict";
import { cnst } from "../cnst";
import { dayjs } from "@core/base";
import { hashPassword, isPasswordMatch } from "@shared/nest";

@Database.Input(() => cnst.KeyringInput)
export class KeyringInput extends Input(cnst.KeyringInput) {}

@Database.Document(() => cnst.Keyring)
export class Keyring extends Document(cnst.Keyring) {
  isFor(userId: string) {
    return this.user === userId;
  }
  has(network: cnst.util.ChainNetwork, address: string) {
    return this.chainWallets.some((chainWallet) => chainWallet.network === network && chainWallet.address === address);
  }
  addChainWallet(network: cnst.util.ChainNetwork, address: string) {
    this.chainWallets = [
      ...this.chainWallets.filter(
        (chainWallet) => !(chainWallet.network === network && chainWallet.address === address)
      ),
      { network, address },
    ];
    if (!this.verifies.includes("wallet")) this.verifies = [...this.verifies, "wallet"];
    return this;
  }
  subChainWallet(network: cnst.util.ChainNetwork, address: string) {
    this.chainWallets = this.chainWallets.filter(
      (chainWallet) => !(chainWallet.network === network && chainWallet.address === address)
    );
    if (!this.chainWallets.length && !this.accountId)
      throw new Error(`Cannot Empty All Wallets keyring(${this.id}), wallet(${network}:${address}`);
    if (!this.chainWallets.length) this.verifies = this.verifies.filter((v) => v !== "wallet");
    return this;
  }
  addNotiDeviceToken(token: string) {
    this.notiDeviceTokens = [...this.notiDeviceTokens, token];
    return this;
  }
  subNotiDeviceToken(token: string) {
    this.notiDeviceTokens = this.notiDeviceTokens.filter((t) => t !== token);
    return this;
  }
  reset() {
    this.set({ chainWallets: [], discord: {}, isOnline: false });
    return this;
  }
  applyIdPassword(accountId: string, password?: string) {
    if (this.accountId && this.accountId !== accountId) throw new Error("Already Applied string Password");
    return this.set({
      accountId,
      password,
      verifies: [...new Set([...this.verifies, "password" as const])],
    });
  }
  applyIdWithSSO(accountId: string, ssoType: cnst.SsoType) {
    if (this.accountId && this.accountId !== accountId) throw new Error("Can't Apply This string");
    return this.set({
      accountId,
      verifies: [...new Set([...this.verifies, ssoType])],
    });
  }
  applyPhoneCode(phone: string, phoneCode: string) {
    if (!this.phone || this.phone !== phone) throw new Error("Invalid Phone Number");
    this.set({
      phoneCode,
      phoneCodeAts: [...this.phoneCodeAts.filter((at) => at.isAfter(dayjs().subtract(3, "minute"))), dayjs()],
    });
    if (this.phoneCodeAts.length > 3) throw new Error("Too Many Phone Code Attempts. Try Again Later.");
    return this;
  }
  getPhoneCodeAt() {
    return this.phoneCodeAts[this.phoneCodeAts.length - 1] ?? dayjs(0);
  }
  applyPhoneVerification(phone: string, phoneCode: string, option: { forceByAdmin?: boolean } = {}) {
    if (!option.forceByAdmin && (this.phone !== phone || this.phoneCode !== phoneCode))
      throw new Revert("keyring.invalidePhoneOrPhoneCodeError");
    if (!option.forceByAdmin && this.phoneCodeAts.at(-1)?.isBefore(dayjs().subtract(3, "minute")))
      throw new Revert("keyring.expiredPhoneCodeError");
    this.set({
      phone,
      phoneCode,
      phoneCodeAts: [this.phoneCodeAts.at(-1) ?? dayjs()],
      verifies: [...new Set([...this.verifies, "phone" as const])],
    });
    return this;
  }
  consumePhoneVerification(phone: string, phoneCode: string) {
    if (this.phone !== phone || this.phoneCode !== phoneCode) throw new Revert("keyring.invalidePhoneOrPhoneCodeError");
    if (!(this.verifies.includes("phone") && this.getPhoneCodeAt().isAfter(dayjs().subtract(3, "minute"))))
      throw new Error("Invalid Phone Verification");
    return this.set({ phoneCode: undefined, phoneCodeAts: [] });
  }
  updateVerifiedAt() {
    this.verifiedAt = dayjs().add(30, "minute");
    return this;
  }
  isResignable(resignupDays = 0) {
    return this.lastLoginAt.isBefore(dayjs().subtract(resignupDays, "day"));
  }
}

interface CreateOption {
  keyringId?: string | null;
  resignupDays?: number;
}

@Database.Model(() => cnst.Keyring)
export class KeyringModel extends Model(Keyring, cnst.keyringCnst) {
  @Loader.ByField("accountId") accountIdLoader: Loader<string, Keyring>;

  async getKeyringIdHasChainWallet(network: cnst.util.ChainNetwork, address: string) {
    const keyring: Keyring | null = await this.Keyring.findOne({
      "chainWallets.network": network,
      "chainWallets.address": address,
      removedAt: { $exists: false },
    });
    return keyring ? keyring.id : null;
  }
  async extinctChainWallet(network: cnst.util.ChainNetwork, address: string, keyringId: string) {
    const { modifiedCount } = await this.Keyring.updateMany(
      {
        _id: { $ne: keyringId },
        "chainWallets.network": network,
        "chainWallets.address": address,
        removedAt: { $exists: false },
      },
      { $pull: { chainWallets: { network, address } } }
    );
    return modifiedCount;
  }
  async pickByChainWallet(network: cnst.util.ChainNetwork, address: string) {
    const keyring = await this.Keyring.pickOne({
      "chainWallets.network": network,
      "chainWallets.address": address,
      removedAt: { $exists: false },
    });
    return keyring;
  }
  async generateWithChainWallet(
    network: cnst.util.ChainNetwork,
    address: string,
    { keyringId, resignupDays }: CreateOption
  ) {
    const inactiveKeyring = await this.Keyring.findOne({
      "chainWallets.network": network,
      "chainWallets.address": address,
      removedAt: { $exists: true },
    }).sort({ createdAt: -1 });
    if (inactiveKeyring && !inactiveKeyring.isResignable(resignupDays))
      throw new Revert("keyring.resignupDaysRemainError");
    const keyring = keyringId
      ? await this.Keyring.pickById(keyringId)
      : (await this.Keyring.findOne({
          "chainWallets.network": network,
          "chainWallets.address": address,
          removedAt: { $exists: false },
        })) ?? new this.Keyring();
    if (keyring.status !== "prepare") throw new Error("Already Activated Wallet");
    return await keyring.addChainWallet(network, address).save();
  }
  async extinctAccountId(accountId: string, keyringId: string) {
    const { modifiedCount } = await this.Keyring.updateMany(
      { _id: { $ne: keyringId }, accountId, removedAt: { $exists: false } },
      { $unset: { accountId: "" }, $pullAll: { verifies: ["password", ...cnst.ssoTypes] } }
    );
    return modifiedCount;
  }
  async generateWithAccountId(accountId: string, password: string, { keyringId, resignupDays }: CreateOption) {
    const inactiveKeyring = await this.Keyring.findOne({ accountId, removedAt: { $exists: true } }).sort({
      createdAt: -1,
    });
    if (inactiveKeyring && !inactiveKeyring.isResignable(resignupDays))
      throw new Revert("keyring.resignupDaysRemainError");
    const keyring = keyringId
      ? await this.Keyring.pickById(keyringId)
      : (await this.Keyring.findOne({ accountId, removedAt: { $exists: false } })) ?? new this.Keyring();
    if (keyring.status !== "prepare") throw new Error("Already Activated AccountId");
    return (await keyring.applyIdPassword(accountId, password).save()) as unknown as Keyring;
  }
  async extinctPhone(phone: string, keyringId: string) {
    const { modifiedCount } = await this.Keyring.updateMany(
      { _id: { $ne: keyringId }, phone, removedAt: { $exists: false } },
      { $unset: { phone: "", phoneCode: "" }, $set: { phoneCodeAts: [] }, $pull: { verifies: "phone" } }
    );
    return modifiedCount;
  }
  async generateWithPhone(phone: string, { keyringId, resignupDays }: CreateOption) {
    const inactiveKeyring = await this.Keyring.findOne({ phone, removedAt: { $exists: true } }).sort({ createdAt: -1 });
    if (inactiveKeyring && !inactiveKeyring.isResignable(resignupDays))
      throw new Revert("keyring.resignupDaysRemainError");
    const keyring = keyringId
      ? await this.Keyring.pickById(keyringId)
      : (await this.Keyring.findOne({ phone, removedAt: { $exists: false } })) ?? new this.Keyring();
    if (keyring.status !== "prepare") throw new Error("Already Activated Phone");
    return await keyring.set({ phone, verifies: keyring.verifies.filter((verify) => verify !== "phone") }).save();
  }
  async getAuthorizedKeyring(accountId: string, password: string) {
    const keyring = (await this.Keyring.findOne({ accountId, status: "active" }).select({
      _id: true,
      role: true,
      password: true,
    })) as unknown as { id: string; role: string; password: string } | null;
    if (!keyring) throw new Revert("keyring.noAccountError");
    else if (!(await isPasswordMatch(password, keyring.password || ""))) throw new Revert("keyring.wrongPasswordError");
    return await this.Keyring.pickById(keyring.id);
  }
  async generateWithSSO(accountId: string, ssoType: cnst.SsoType, { keyringId, resignupDays }: CreateOption) {
    const inactiveKeyring = await this.Keyring.findOne({ accountId, removedAt: { $exists: true } }).sort({
      createdAt: -1,
    });
    if (inactiveKeyring && !inactiveKeyring.isResignable(resignupDays))
      throw new Revert("keyring.resignupDaysRemainError");
    const keyring = keyringId
      ? await this.Keyring.pickById(keyringId)
      : (await this.findByAccountId(accountId)) ?? new this.Keyring();
    if (keyring.status !== "prepare") throw new Error("Already Activated Phone");
    return (await keyring.applyIdWithSSO(accountId, ssoType).save()) as unknown as Keyring;
  }
  async getKeyringWithSSO(accountId: string, ssoType: cnst.SsoType) {
    const keyring = await this.Keyring.findOne({ accountId, removedAt: { $exists: false } });
    if (!keyring) throw new Error("Signin Failed(SSO Status Mismatch)");
    if (!keyring.verifies.includes(ssoType)) throw new Error("Signin Failed(SSO Not Registered)");
    return keyring;
  }
  async getSummary(): Promise<cnst.KeyringSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Keyring)
export class KeyringMiddleware extends Middleware(KeyringModel, Keyring) {
  onSchema(schema: SchemaOf<KeyringModel, Keyring>) {
    schema.pre<Keyring>("save", async function (next) {
      if (!this.isModified("password") || !this.password) {
        next();
        return;
      }
      const encryptedPassword = await hashPassword(this.password);
      this.password = encryptedPassword;
      if (this.removedAt) this.reset();
      next();
    });
    schema.index({ accountId: "text", name: "text", phone: "text" });
  }
}
