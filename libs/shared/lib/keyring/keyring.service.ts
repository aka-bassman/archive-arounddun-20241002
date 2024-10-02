import * as db from "../db";
import { Account, dayjs } from "@core/base";
import { DbService, Service, Srv, Use } from "@core/server";
import { Revert } from "../dict";
import { cnst } from "../cnst";
import { randomCode, randomString } from "@core/common";
import type * as srv from "../srv";
import type { GmailApi, PurpleApi } from "@util/nest";

@Service("KeyringService")
export class KeyringService extends DbService(db.keyringDb) {
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly fileService: srv.FileService;
  @Srv() protected readonly settingService: srv.SettingService;
  @Srv() protected readonly securityService: srv.util.SecurityService;
  @Use() protected readonly host: string;
  @Use() protected readonly gmailApi: GmailApi;
  @Use() protected readonly purpleApi: PurpleApi;

  async whoAmI(keyringId: string) {
    const lastLoginAt = dayjs();
    const [keyring, user] = await Promise.all([
      this.keyringModel.getKeyring(keyringId),
      this.userService.generateWithKeyring(keyringId),
    ]);
    if (!keyring.isFor(user.id)) keyring.set({ user: user.id });
    void keyring.set({ lastLoginAt }).save();
    void user.set({ lastLoginAt }).save();
    return user;
  }
  async generateJwt(keyring: db.Keyring, account?: Account) {
    const user = await this.whoAmI(keyring.id);
    const image = user.image ? await this.fileService.getFile(user.image) : null;
    return this.securityService.generateJwt({ keyring, user, image, account });
  }
  async refreshJwt(keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    const user = await this.whoAmI(keyring.id);
    const image = user.image ? await this.fileService.getFile(user.image) : null;
    return this.securityService.generateJwt({ keyring, user, image });
  }
  async signinWithVerification(keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (!keyring.verifiedAt || keyring.verifiedAt.isAfter(dayjs().add(30, "minute")))
      throw new Error("Verification Expired");
    await keyring.set({ verifiedAt: undefined }).save();
    return this.generateJwt(keyring);
  }
  async updatePrepareKeyring(keyringId: string, data: db.KeyringInput) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status !== "prepare") throw new Error("Already Activated Keyring");
    // if (accountId !== keyring.accountId) throw new Error("Not your keyring");
    return await keyring.set({ ...data }).save();
    // return (await this.Keyring.findOne({ accountId, status: "active" }));
  }
  async signoutUser(account: Account) {
    const lastLoginAt = dayjs();
    if (!account.myKeyring || !account.self) throw new Error("No Account on MyKeyring or Self");
    const keyring = await this.keyringModel.getKeyring(account.myKeyring.id);
    const user = await this.userService.getUser(account.self.id);
    void keyring.set({ lastLoginAt }).save();
    void user.set({ lastLoginAt }).save();
    return this.securityService.generateJwt({ admin: account.me });
  }
  async addNotiDeviceToken(keyringId: string, notiDeviceToken: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.addNotiDeviceToken(notiDeviceToken).save();

    //  const keyring = await this.addNotiDeviceToken(notiDeviceToken);
    return;
  }
  async subNotiDeviceToken(keyringId: string, notiDeviceToken: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.subNotiDeviceToken(notiDeviceToken).save();
  }

  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  async getKeyringIdHasChainWallet(network: cnst.util.ChainNetwork, address: string) {
    return await this.keyringModel.getKeyringIdHasChainWallet(network, address);
  }
  async signupChainWallet(
    network: cnst.util.ChainNetwork,
    keyringId: string | null,
    address: string
  ): Promise<db.Keyring> {
    const setting = await this.settingService.getActiveSetting();
    const keyring = await this.keyringModel.generateWithChainWallet(network, address, {
      keyringId,
      resignupDays: setting.resignupDays,
    });
    const num = await this.keyringModel.extinctChainWallet(network, address, keyring.id);
    this.logger.log(`${num} Keyrings removed for wallet ${network}:${address}`);
    return keyring;
  }
  async signinChainWallet(
    network: cnst.util.ChainNetwork,
    address: string,
    account?: Account
  ): Promise<cnst.util.AccessToken> {
    const keyring = await this.keyringModel.pickByChainWallet(network, address);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return this.generateJwt(keyring, account);
  }
  async signaddChainWallet(network: cnst.util.ChainNetwork, address: string, keyringId: string) {
    const keyring = await this.keyringModel.pickByChainWallet(network, address);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    const num = await this.keyringModel.extinctChainWallet(network, address, keyringId);
    this.logger.log(`${num} Keyrings removed for wallet ${network}:${address}`);
    return await keyring.addChainWallet(network, address).save();
  }
  async signsubChainWallet(network: cnst.util.ChainNetwork, address: string, keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await keyring.subChainWallet(network, address).save();
  }
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  async getKeyringIdHasAccountId(accountId: string) {
    return await this.keyringModel.findIdByAccountId(accountId, "active");
  }
  async signupPassword(accountId: string, password: string, keyringId: string | null): Promise<db.Keyring> {
    const setting = await this.settingService.getActiveSetting();
    const keyring = await this.keyringModel.generateWithAccountId(accountId, password, {
      keyringId,
      resignupDays: setting.resignupDays,
    });
    await this.keyringModel.extinctAccountId(accountId, keyring.id);
    return keyring;
  }
  async signinPassword(accountId: string, password: string, account?: Account): Promise<cnst.util.AccessToken> {
    const keyring = await this.keyringModel.getAuthorizedKeyring(accountId, password);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await this.generateJwt(keyring, account);
  }
  async signaddPassword(accountId: string, password: string, keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.verifies.includes("password")) throw new Error("Already has password");
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await this.keyringModel.extinctAccountId(accountId, keyring.id);
    return await keyring.applyIdPassword(accountId, password).save();
  }
  async changePassword(password: string, prevPassword: string, keyringId: string) {
    const prevKeyring = await this.keyringModel.getKeyring(keyringId);
    if (!prevKeyring.accountId) throw new Error("No Account Id");
    const keyring = await this.keyringModel.getAuthorizedKeyring(prevKeyring.accountId, prevPassword);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return await keyring.set({ password }).save();
  }
  async changePasswordWithPhone(password: string, phone: string, phoneCode: string, keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (!keyring.verifies.includes("phone")) throw new Error("Unable to change password with phone");
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    return await keyring.set({ password }).save();
  }
  async resetPassword(accountId: string): Promise<boolean> {
    const keyring = await this.keyringModel.findByAccountId(accountId);
    if (!keyring) throw new Revert("keyring.accountNotFoundError");
    if (keyring.status !== "active") throw new Error("Not activated yet");
    if (keyring.updatedAt.isAfter(dayjs().subtract(3, "minute"))) throw new Error(`Retry after 3 minutes`);
    const password = randomString();
    await keyring.set({ password }).save();
    return this.gmailApi.sendPasswordResetMail(accountId, password, this.host);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  async getKeyringIdHasPhone(phone: string) {
    return await this.keyringModel.findIdByPhone(phone, "active");
  }
  async addPhoneInPrepareKeyring(phone: string, keyringId: string | null): Promise<db.Keyring> {
    if (await this.keyringModel.existsByPhone(phone, "active")) throw new Error("Already used phone number");
    const setting = await this.settingService.getActiveSetting();
    const keyring = await this.keyringModel.generateWithPhone(phone, { keyringId, resignupDays: setting.resignupDays });
    return keyring;
  }
  async addPhoneInActiveKeyring(phone: string, keyringId: string): Promise<db.Keyring> {
    const keyrings = await this.keyringModel.listByPhone(phone, "active");
    if (keyrings.some((keyring) => keyring.id !== keyringId && keyring.verifies.includes("phone")))
      throw new Error("Already used phone number");
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.set({ phone }).save();
  }
  async requestPhoneCode(keyringId: string, phone: string, hash: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    const dryrun = cnst.MASTER_PHONES.includes(phone);
    const phoneCode = cnst.MASTER_PHONES.includes(phone) ? cnst.MASTER_PHONECODE : randomCode(6);
    await keyring.applyPhoneCode(phone, phoneCode).save();
    if (!keyring.phone || !keyring.phoneCode) throw new Error("No Phone or PhoneCode");
    if (!dryrun) await this.purpleApi.sendPhoneCode(keyring.phone, keyring.phoneCode, hash);
    return keyring.getPhoneCodeAt();
  }
  async verifyPhoneCode(keyringId: string, phone: string, phoneCode: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.applyPhoneVerification(phone, phoneCode).save();
  }
  async signupPhone(keyringId: string, phone: string, phoneCode: string, data?: db.KeyringInput): Promise<db.Keyring> {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status !== "prepare") throw new Error("Already Activated Keyring");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    await this.keyringModel.extinctPhone(phone, keyring.id);
    return await keyring.set({ ...data }).save();
  }
  async signinPhone(keyringId: string, phone: string, phoneCode: string, account?: Account) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).updateVerifiedAt().save();

    return this.generateJwt(keyring, account);
  }
  async signaddPhone(keyringId: string, phone: string, phoneCode: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.consumePhoneVerification(phone, phoneCode).save();
    await this.keyringModel.extinctPhone(phone, keyring.id);
    return keyring;
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  async removeMyAccount(keyringId: string, leaveInfo: db.LeaveInfo) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return (await this.removeKeyring(keyring.id)).set({ leaveInfo }).save();
  }

  async summarize(): Promise<cnst.KeyringSummary> {
    return {
      ...(await this.keyringModel.getSummary()),
    };
  }

  //*====================== SSO Signing Area ======================*//
  //*================================================================*//
  async signupSso(accountId: string, ssoType: cnst.SsoType, keyringId?: string) {
    const setting = await this.settingService.getActiveSetting();
    const resignupDays = setting.resignupDays;
    const keyring = await this.keyringModel.generateWithSSO(accountId, ssoType, { keyringId, resignupDays });
    await this.keyringModel.extinctAccountId(accountId, keyring.id);
    return keyring;
  }
  async signinSso(accountId: string, ssoType: cnst.SsoType, account?: Account): Promise<cnst.util.AccessToken> {
    const keyring = await this.keyringModel.getKeyringWithSSO(accountId, ssoType);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    return this.generateJwt(keyring, account);
  }
  async signaddSso(keyringId: string, accountId: string, ssoType: cnst.SsoType): Promise<db.Keyring> {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.verifies.includes(ssoType)) throw new Error(`Already has ${ssoType} SSO`);
    if (keyring.status !== "active") throw new Error("Not activated yet");
    await keyring.applyIdWithSSO(accountId, ssoType).save();
    await this.keyringModel.extinctAccountId(accountId, keyring.id);
    return keyring;
  }
  async activateUser(keyringId: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (keyring.status === "active") throw new Error("Already activated");
    // TODO: check minimum verification levels
    return await keyring.set({ status: "active" }).save();
  }

  //*================================================================*//
  //*====================== Admin Control Area ======================*//
  async changeAccountIdByAdmin(keyringId: string, accountId: string) {
    if (await this.getKeyringIdHasAccountId(accountId)) throw new Error("Already used account id");
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.set({ accountId }).save();
  }
  async changePasswordByAdmin(keyringId: string, password: string) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (!keyring.accountId) throw new Error("No Account Id");
    return await keyring.applyIdPassword(keyring.accountId, password).save();
  }
  async changePhoneByAdmin(keyringId: string, phone: string) {
    if (await this.getKeyringIdHasPhone(phone)) throw new Error("Already used phone number");
    const keyring = await this.keyringModel.getKeyring(keyringId);
    return await keyring.applyPhoneVerification(phone, "000000", { forceByAdmin: true }).save();
  }
  async createUserForKeyringByAdmin(keyringId: string, data: db.UserInput) {
    const keyring = await this.keyringModel.getKeyring(keyringId);
    if (!keyring.accountId) throw new Error("No Account Id");
    const user = await this.userService.generateWithKeyring(keyring.id, data);
    await user.set({ keyring: keyring.id }).save();
    return keyring.set({ user: user.id, status: "active" }).save();
  }

  //*====================== Admin Control Area ======================*//
  //*================================================================*//
  async accountIdLoad(accountId?: string | null) {
    return accountId ? await this.keyringModel.accountIdLoader.load(accountId) : null;
  }
  async accountIdLoadMany(accountIds: string[]) {
    return (await this.keyringModel.accountIdLoader.loadMany(accountIds)) as (db.Keyring | null)[];
  }
}
