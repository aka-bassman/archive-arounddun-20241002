import { Dayjs, DefaultOf, dayjs } from "@core/base";
import { LoginForm } from "@core/next";
import { Store, Toast, router, setAuth, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { isPhoneNumber } from "@core/common";
import { msg } from "../dict";
import type { RootStore } from "../store";

@Store(() => cnst.Keyring)
export class KeyringStore extends stateOf(fetch.keyringGql, {
  myKeyring: fetch.defaultKeyring as cnst.Keyring,
  signupKeyring: null as cnst.Keyring | null, // 회원가입용 keyring
  verifyingKeyringId: null as string | null, // 인증 전 keyringId
  password: "",
  passwordConfirm: "",
  prevPassword: "",
  phoneCode: "",
  phoneCodeAt: null as Dayjs | null,
  turnstileToken: null as string | null,
  resetPasswordMailSent: false,
  sameAccountIdExists: "unknown" as "unknown" | boolean,
  sameNicknameExists: "unknown" as "unknown" | boolean,
  deviceToken: "" as string,
}) {
  async initUserAuth() {
    this.set({ myKeyring: await fetch.myKeyring() });
  }
  @Toast()
  async signupChainWallet(loginForm?: Partial<LoginForm>) {
    const { signupKeyring } = this.get();
    const keyring = await fetch.signupChainWallet(signupKeyring?.id);
    if (!loginForm) {
      this.set({ signupKeyring: keyring });
      return;
    }
    await fetch.activateUser(keyring.id);
    await this.signinChainWallet(loginForm);
  }
  @Toast()
  async signinChainWallet(loginForm: Partial<LoginForm> = {}) {
    const { jwt } = await fetch.signinChainWallet();
    await (this as unknown as RootStore).login({ auth: "user", jwt, ...loginForm });
    this.set({ signupKeyring: null });
  }
  async signuporinChainWallet(loginForm: Partial<LoginForm> = {}) {
    const keyringId = await fetch.getKeyringIdHasChainWallet();
    if (keyringId) {
      await this.signinChainWallet(loginForm);
      return;
    } else {
      await this.signupChainWallet(loginForm);
      return;
    }
  }
  @Toast()
  async signaddChainWallet() {
    const keyring = await fetch.signaddChainWallet();
    this.set({ myKeyring: keyring, keyringModal: null });
  }
  async signsubChainWallet(network: cnst.util.ChainNetwork, address: string) {
    msg.loading("keyring.deleteLoading", { key: "deleteWallet" });
    const myKeyring = await fetch.signsubChainWallet(network, address);
    this.set({ myKeyring, keyringModal: null });
    msg.success("keyring.deleteSuccess", { key: "deleteWallet" });
  }
  @Toast()
  async signupPassword(loginForm?: Partial<LoginForm>) {
    const { signupKeyring, keyringForm, password, turnstileToken } = this.get();
    if (!turnstileToken) return;
    const keyring = await fetch.signupPassword(
      keyringForm.accountId ?? "",
      password,
      turnstileToken,
      signupKeyring?.id
    );
    if (!loginForm) {
      this.set({ password: "", signupKeyring: keyring, keyringForm: { ...fetch.defaultKeyring } });
      return;
    }
    await fetch.activateUser(keyring.id);
    if (loginForm.redirect) router.push(loginForm.redirect);
  }
  @Toast()
  async signinPassword(loginForm: Partial<LoginForm> = {}) {
    const { keyringForm, password } = this.pick("keyringForm", "password");
    const { jwt } = await fetch.signinPassword(keyringForm.accountId ?? "", password, "token");
    await (this as unknown as RootStore).login({ auth: "user", jwt, ...loginForm });
    this.set({ password: "", turnstileToken: "", keyringForm: { ...fetch.defaultKeyring }, signupKeyring: null });
  }
  async signaddPassword() {
    const { keyringForm, password, turnstileToken } = this.pick("keyringForm", "password", "turnstileToken");
    const myKeyring = await fetch.signaddPassword(keyringForm.accountId ?? "", password, turnstileToken);
    this.set({
      myKeyring,
      password: "",
      passwordConfirm: "",
      keyringForm: { ...fetch.defaultKeyring },
    });
  }
  @Toast()
  async changePassword() {
    const { password, prevPassword, turnstileToken } = this.pick("password", "prevPassword", "turnstileToken");
    if (!window.confirm("Do you want to change your password?")) return;
    await fetch.changePassword(password, prevPassword, turnstileToken);
    this.set({ keyringModal: null, password: "", prevPassword: "", turnstileToken: null });
  }
  @Toast()
  async changePasswordWithPhone() {
    const { myKeyring, password, phoneCode } = this.pick("myKeyring", "password", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    if (!window.confirm("Do you want to change your password?")) return;
    await fetch.changePasswordWithPhone(password, myKeyring.phone, phoneCode);
    this.set({ keyringModal: null, password: "", phoneCode: "", phoneCodeAt: null });
  }
  async resetPassword() {
    const { keyringForm } = this.get();
    await fetch.resetPassword(keyringForm.accountId ?? "");
    (this as unknown as RootStore).showMessage({
      content: "Reset password request sent. Please check your email.",
      type: "success",
    });
    this.resetKeyring();
  }
  async requestPhoneCode(keyringId: string, phone: string, hash = "signin") {
    if (dayjs().subtract(5, "seconds").isBefore(this.get().phoneCodeAt)) return;
    const phoneCodeAt = await fetch.requestPhoneCode(keyringId, phone, hash);
    this.set({ phoneCodeAt, phoneCode: "" });
  }
  async verifyPhone(hash = "signin") {
    const { keyringForm } = this.get() as unknown as RootStore;
    if (!keyringForm.phone) return;
    const keyringIdHasPhone = await fetch.getKeyringIdHasPhone(keyringForm.phone);
    let keyringId = keyringIdHasPhone;
    if (!keyringIdHasPhone) {
      const keyring = await fetch.addPhoneInPrepareKeyring(keyringForm.phone);
      keyringId = keyring.id;
      this.set({ signupKeyring: keyring });
    }
    this.set({ verifyingKeyringId: keyringId });
    await this.requestPhoneCode(keyringId, keyringForm.phone, hash);
  }
  async updatePrepareKeyring(keyringId: string) {
    const { keyringForm } = this.pick("keyringForm");
    const purifyKeyring = fetch.purifyKeyring(keyringForm);
    if (!purifyKeyring) return;
    const keyring = await fetch.updatePrepareKeyring(keyringId, purifyKeyring);
    this.set({ signupKeyring: keyring });
  }

  async verifyPhoneCode() {
    const { myKeyring, phoneCode } = this.pick("myKeyring", "phoneCode");
    if (!myKeyring.phone) throw new Error("No phone number");
    const keyring = await fetch.verifyPhoneCode(myKeyring.id, myKeyring.phone, phoneCode);
    this.set({ myKeyring: keyring });
  }
  async signinWithVerification(keyringId: string) {
    const { jwt } = await fetch.signinWithVerification(keyringId);
    setAuth({ jwt });
  }
  async signupPhone(loginForm?: Partial<LoginForm>) {
    const { signupKeyring, phoneCode, keyringForm } = this.pick("signupKeyring", "phoneCode", "keyringForm");
    if (!signupKeyring.phone || !isPhoneNumber(signupKeyring.phone)) return;
    await fetch.verifyPhoneCode(signupKeyring.id, signupKeyring.phone, phoneCode);
    const keyringData = fetch.purifyKeyring(keyringForm);
    const keyring = await fetch.signupPhone(
      signupKeyring.id,
      signupKeyring.phone,
      phoneCode,
      keyringData ? keyringData : undefined
    );
    this.set({ signupKeyring: keyring });
    if (!loginForm) this.set({ phoneCode: "", phoneCodeAt: null, verifyingKeyringId: null });
    // await fetch.activateUser(keyring.id);
    // await this.signinPhone(keyring.id, signupKeyring.phone, loginForm);
  }

  async signupOrSigninPhone() {
    const { signupKeyring } = this.get() as unknown as RootStore;
    signupKeyring ? await this.signupPhone() : await this.signinPhone();
  }

  async signaddPhone(hash?: string) {
    const { myKeyring, phoneCode } = this.pick("myKeyring", "phoneCode");
    if (!myKeyring.phone || !isPhoneNumber(myKeyring.phone)) return;
    this.set({
      myKeyring: await fetch.signaddPhone(myKeyring.phone, phoneCode),
      phoneCodeAt: null,
      phoneCode: "",
    });
  }

  async removeAccount() {
    const { myKeyring, keyringForm } = this.pick("myKeyring", "keyringForm");
    await fetch.removeMyAccount(keyringForm.leaveInfo);
    await (this as unknown as RootStore).logout();
  }

  async signinPhone(loginForm: Partial<LoginForm> = {}) {
    const { verifyingKeyringId, keyringForm, phoneCode } = this.get() as unknown as RootStore;
    if (!keyringForm.phone || !isPhoneNumber(keyringForm.phone) || !verifyingKeyringId) return;
    const { jwt } = await fetch.signinPhone(verifyingKeyringId, keyringForm.phone, phoneCode);
    await (this as unknown as RootStore).login({ auth: "user", jwt, ...loginForm });
    this.set({ phoneCodeAt: null, phoneCode: "", signupKeyring: null, verifyingKeyringId: null });
  }

  async checkSameAccountIdExists(accountId: string) {
    if (!accountId.length) {
      this.set({ sameAccountIdExists: "unknown" });
      return;
    }
    const keyringId = await fetch.getKeyringIdHasAccountId(accountId);
    this.set({ sameAccountIdExists: !!keyringId });
  }
  async checkSameNicknameExists(nickname: string) {
    if (!nickname.length) {
      this.set({ sameNicknameExists: "unknown" });
      return;
    }
    const userId = await fetch.getUserIdHasNickname(nickname);
    this.set({ sameNicknameExists: !!userId });
  }
  async refreshJwt() {
    const { myKeyring } = this.get() as unknown as RootStore;
    if (!myKeyring.id) return;
    const { jwt } = await fetch.refreshJwt();
    setAuth({ jwt });
  }
  async changeAccountIdByAdmin(accountId: string) {
    const { keyring } = this.pick("keyring");
    msg.loading("keyring.changeAccountIdLoading", { key: "changeAccountIdByAdmin" });
    this.set({ keyring: await fetch.changeAccountIdByAdmin(keyring.id, accountId) });
    msg.success("keyring.changeAccountIdSuccess", { key: "changeAccountIdByAdmin" });
  }
  async changePasswordByAdmin(password: string) {
    const { keyring } = this.pick("keyring");
    msg.loading("keyring.changePasswordLoading", { key: "changePasswordByAdmin" });
    this.set({ keyring: await fetch.changePasswordByAdmin(keyring.id, password) });
    msg.success("keyring.changePasswordSuccess", { key: "changePasswordByAdmin" });
  }
  async changePhoneByAdmin(phone: string) {
    const { keyring } = this.pick("keyring");
    msg.loading("keyring.changePhoneLoading", { key: "changePhoneByAdmin" });
    this.set({ keyring: await fetch.changePhoneByAdmin(keyring.id, phone) });
    msg.success("keyring.changePhoneSuccess", { key: "changePhoneByAdmin" });
  }
  async createUserForKeyringByAdmin(keyringId: string, userForm: DefaultOf<cnst.User>) {
    const input = fetch.purifyUser(userForm);
    if (!input) return;
    msg.loading("keyring.createUserLoading", { key: "createUserForKeyringByAdmin" });
    this.setKeyring(await fetch.createUserForKeyringByAdmin(keyringId, input));
    msg.success("keyring.createUserSuccess", { key: "createUserForKeyringByAdmin" });
  }
  async addNotiDeviceTokensOfMyKeyring(notiDeviceToken: string) {
    const { myKeyring } = this.get();
    if (!myKeyring.id) return;
    const keyring = await fetch.addNotiDeviceTokensOfMyKeyring(notiDeviceToken);
    this.set({ myKeyring: keyring });
  }
  async subNotiDeviceTokensOfMyKeyring(notiDeviceToken: string) {
    const { myKeyring } = this.get();
    if (!myKeyring.id) return;
    const keyring = await fetch.subNotiDeviceTokensOfMyKeyring(notiDeviceToken);
    this.set({ myKeyring: keyring });
  }
}
