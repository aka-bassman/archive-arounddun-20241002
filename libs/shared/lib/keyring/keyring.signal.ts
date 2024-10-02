import {
  Account,
  Arg,
  Dayjs,
  DbSignal,
  ID,
  JSON,
  Mutation,
  MyKeyring,
  Query,
  Req,
  Res,
  Signal,
  Signature,
  resolve,
} from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";
import type { FacebookResponse, GithubResponse, GoogleResponse, KakaoResponse, NaverResponse } from "@core/nest";

@Signal(() => cnst.Keyring)
export class KeyringSignal extends DbSignal(cnst.keyringCnst, Srvs, {
  guards: { get: Query.Admin, cru: Mutation.Every },
}) {
  @Query.Public(() => cnst.Keyring)
  async myKeyring(@MyKeyring() myKeyring: MyKeyring) {
    const keyring = await this.keyringService.getKeyring(myKeyring.id);
    if (keyring.status !== "active") throw new Error("Invalid Keyring Status");
    return resolve<cnst.Keyring>(keyring);
  }
  @Query.User(() => cnst.User)
  async whoAmI(@MyKeyring() myKeyring: MyKeyring) {
    const user = await this.keyringService.whoAmI(myKeyring.id);
    return resolve<cnst.User>(user);
  }
  @Mutation.User(() => cnst.util.AccessToken)
  async refreshJwt(@Account() account: Account) {
    if (!account.myKeyring) throw new Error("Invalid MyKeyring");
    const accessToken = await this.keyringService.refreshJwt(account.myKeyring.id);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.Public(() => cnst.util.AccessToken)
  async signinWithVerification(@Arg.Param("keyringId", () => ID) keyringId: string) {
    const accessToken = await this.keyringService.signinWithVerification(keyringId);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.Public(() => cnst.util.AccessToken)
  async signoutUser(@Account() account: Account) {
    const accessToken = await this.keyringService.signoutUser(account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.User(() => cnst.Keyring)
  async addNotiDeviceTokensOfMyKeyring(
    @Arg.Body("notiDeviceToken", () => String) notiDeviceToken: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const keyring = await this.keyringService.addNotiDeviceToken(myKeyring.id, notiDeviceToken);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.User(() => cnst.Keyring)
  async subNotiDeviceTokensOfMyKeyring(
    @Arg.Body("notiDeviceToken", () => String) notiDeviceToken: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const keyring = await this.keyringService.subNotiDeviceToken(myKeyring.id, notiDeviceToken);
    return resolve<cnst.Keyring>(keyring);
  }
  //*=================================================================*//
  //*====================== Wallet Signing Area ======================*//
  @Query.Public(() => ID, { nullable: true })
  async getKeyringIdHasChainWallet(@Signature() signature: Signature) {
    const wallet = await this.keyringService.getKeyringIdHasChainWallet(signature.network, signature.address);
    return resolve<string>(wallet);
  }
  @Mutation.Public(() => cnst.Keyring)
  async signupChainWallet(
    @Arg.Body("keyringId", () => ID, { nullable: true }) keyringId: string | undefined,
    @Signature() signature: Signature
  ) {
    const keyring = await this.keyringService.signupChainWallet(
      signature.network,
      keyringId ? keyringId : null,
      signature.address
    );
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Public(() => cnst.util.AccessToken)
  async signinChainWallet(@Signature() signature: Signature, @Account() account: Account) {
    const accessToken = await this.keyringService.signinChainWallet(signature.network, signature.address, account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.Every(() => cnst.Keyring)
  async signaddChainWallet(@Signature() signature: Signature, @MyKeyring() myKeyring: MyKeyring) {
    const keyring = await this.keyringService.signaddChainWallet(signature.network, signature.address, myKeyring.id);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Every(() => cnst.Keyring)
  async signsubChainWallet(
    @Arg.Param("network", () => String) network: cnst.util.ChainNetwork,
    @Arg.Param("address", () => String) address: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const keyring = await this.keyringService.signsubChainWallet(network, address, myKeyring.id);
    return resolve<cnst.Keyring>(keyring);
  }
  //*====================== Wallet Signing Area ======================*//
  //*=================================================================*//

  //*===================================================================*//
  //*====================== Password Signing Area ======================*//
  @Query.Public(() => ID, { nullable: true })
  async getKeyringIdHasAccountId(@Arg.Query("accountId", () => String) accountId: string) {
    const id = await this.keyringService.getKeyringIdHasAccountId(accountId);
    return resolve<string>(id);
  }
  @Query.Public(() => cnst.Keyring)
  async updatePrepareKeyring(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("data", () => cnst.KeyringInput) data: db.KeyringInput
  ) {
    const keyring = await this.keyringService.updatePrepareKeyring(keyringId, data);
    return resolve<cnst.Keyring>(keyring);
  }

  @Mutation.Public(() => cnst.Keyring)
  async signupPassword(
    @Arg.Body("accountId", () => String) accountId: string,
    @Arg.Body("password", () => String) password: string,
    @Arg.Body("token", () => String) token: string,
    @Arg.Param("keyringId", () => ID, { nullable: true }) keyringId: string | undefined
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    const keyring = await this.keyringService.signupPassword(accountId, password, keyringId ? keyringId : null);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Public(() => cnst.util.AccessToken)
  async signinPassword(
    @Arg.Body("accountId", () => String) accountId: string,
    @Arg.Body("password", () => String) password: string,
    @Arg.Body("token", () => String) token: string,
    @Account() account: Account
  ) {
    //! 임시 비활
    //if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    const accessToken = await this.keyringService.signinPassword(accountId, password, account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.Every(() => cnst.Keyring)
  async signaddPassword(
    @Arg.Body("accountId", () => String) accountId: string,
    @Arg.Body("password", () => String, { nullable: true }) password: string,
    @Arg.Body("token", () => String) token: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    const keyring = await this.keyringService.signaddPassword(accountId, password, myKeyring.id);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Every(() => Boolean)
  async changePassword(
    @Arg.Body("password", () => String) password: string,
    @Arg.Body("prevPassword", () => String) prevPassword: string,
    @Arg.Body("token", () => String) token: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    //! 임시 비활
    // if (!(await this.cloudflareService.isVerified(token))) throw new Error("Invalid Turnstile Token");
    await this.keyringService.changePassword(password, prevPassword, myKeyring.id);
    return resolve<boolean>(true);
  }
  @Mutation.Every(() => Boolean)
  async changePasswordWithPhone(
    @Arg.Body("password", () => String) password: string,
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("phoneCode", () => String) phoneCode: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    await this.keyringService.changePasswordWithPhone(password, phone, phoneCode, myKeyring.id);
    return resolve<boolean>(true);
  }
  @Mutation.Public(() => Boolean)
  async resetPassword(@Arg.Body("accountId", () => String) accountId: string) {
    return await this.keyringService.resetPassword(accountId);
  }
  //*====================== Password Signing Area ======================*//
  //*===================================================================*//

  //*================================================================*//
  //*====================== Phone Signing Area ======================*//
  @Query.Public(() => ID, { nullable: true })
  async getKeyringIdHasPhone(@Arg.Query("phone", () => String) phone: string) {
    const id = await this.keyringService.getKeyringIdHasPhone(phone);
    return resolve<string>(id);
  }
  @Mutation.Public(() => cnst.Keyring)
  async addPhoneInPrepareKeyring(
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Param("keyringId", () => ID, { nullable: true }) keyringId: string | undefined
  ) {
    const keyring = await this.keyringService.addPhoneInPrepareKeyring(phone, keyringId ? keyringId : null);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.User(() => cnst.Keyring)
  async addPhoneInActiveKeyring(@Arg.Body("phone", () => String) phone: string, @MyKeyring() myKeyring: MyKeyring) {
    return await this.keyringService.addPhoneInActiveKeyring(phone, myKeyring.id);
  }
  @Mutation.Public(() => Date)
  async requestPhoneCode(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("hash", () => String) hash: string
  ) {
    const date = await this.keyringService.requestPhoneCode(keyringId, phone, hash);
    return resolve<Dayjs>(date);
  }
  @Mutation.Public(() => cnst.Keyring)
  async verifyPhoneCode(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("phoneCode", () => String) phoneCode: string
  ) {
    const keyring = await this.keyringService.verifyPhoneCode(keyringId, phone, phoneCode);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Public(() => cnst.Keyring)
  async signupPhone(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("phoneCode", () => String) phoneCode: string,
    @Arg.Body("data", () => cnst.KeyringInput, { nullable: true }) data: db.KeyringInput | undefined
  ) {
    const keyring = await this.keyringService.signupPhone(keyringId, phone, phoneCode, data);
    return resolve<cnst.Keyring>(keyring);
  }

  @Mutation.Public(() => cnst.util.AccessToken)
  async signinPhone(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("phoneCode", () => String) phoneCode: string,
    @Account() account: Account
  ) {
    const accessToken = await this.keyringService.signinPhone(keyringId, phone, phoneCode, account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  @Mutation.User(() => cnst.Keyring)
  async signaddPhone(
    @Arg.Body("phone", () => String) phone: string,
    @Arg.Body("phoneCode", () => String) phoneCode: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const keyring = await this.keyringService.signaddPhone(myKeyring.id, phone, phoneCode);
    return resolve<cnst.Keyring>(keyring);
  }
  //*====================== Phone Signing Area ======================*//
  //*================================================================*//
  @Mutation.Public(() => cnst.Keyring)
  async activateUser(@Arg.Param("keyringId", () => ID) keyringId: string) {
    const keyring = await this.keyringService.activateUser(keyringId);
    return resolve<cnst.Keyring>(keyring);
  }

  @Mutation.Public(() => cnst.Keyring)
  async removeMyAccount(
    @Arg.Body("leaveInfo", () => cnst.LeaveInfo, { nullable: true }) leaveInfo: db.LeaveInfo,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const keyring = await this.keyringService.removeMyAccount(myKeyring.id, leaveInfo);
    return resolve<cnst.Keyring>(keyring);
  }
  //*================================================================*//
  //*====================== Admin Control Area ======================*//

  @Mutation.Admin(() => cnst.Keyring)
  async changeAccountIdByAdmin(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("accountId", () => String) accountId: string
  ) {
    const keyring = await this.keyringService.changeAccountIdByAdmin(keyringId, accountId);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Admin(() => cnst.Keyring)
  async changePasswordByAdmin(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("password", () => String) password: string
  ) {
    const keyring = await this.keyringService.changePasswordByAdmin(keyringId, password);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Admin(() => cnst.Keyring)
  async changePhoneByAdmin(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("phone", () => String) phone: string
  ) {
    const keyring = await this.keyringService.changePhoneByAdmin(keyringId, phone);
    return resolve<cnst.Keyring>(keyring);
  }
  @Mutation.Admin(() => cnst.Keyring)
  async createUserForKeyringByAdmin(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("data", () => cnst.UserInput) data: db.UserInput
  ) {
    const keyring = await this.keyringService.createUserForKeyringByAdmin(keyringId, data);
    return resolve<cnst.Keyring>(keyring);
  }
  @Query.Admin(() => cnst.util.AccessToken)
  async getAccessTokenByAdmin(@Arg.Param("keyringId", () => ID) keyringId: string) {
    const keyring = await this.keyringService.getKeyring(keyringId);
    const accessToken = await this.keyringService.generateJwt(keyring);
    return resolve<cnst.util.AccessToken>(accessToken);
  }
  //*====================== Admin Control Area ======================*//
  //*================================================================*//

  //*======================================================*//
  //*====================== SSO Area ======================*//
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "github" })
  github() {
    return "unreachable";
  }
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "github", path: "github/callback" })
  async githubCallback(@Req() req: Req, @Res() res: Res) {
    const user = req.user as GithubResponse;
    if (req.cookies.path === "/admin") {
      const accessToken = await this.adminService.ssoSigninAdmin(user.username, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false });
      res.redirect(`${req.cookies.siteurl}/admin`);
      return;
    }
    const keyring = await this.keyringService.findByAccountId(user.username);
    if (!keyring || keyring.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(user.username, "github");
      const accessToken = await this.keyringService.generateJwt(signupKeyring, req.account);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}/signup?ssoType=github`);
    } else if (!keyring.verifies.includes("github")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, user.username, "github");
      const accessToken = await this.keyringService.generateJwt(myKeyring, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    } else {
      const accessToken = await this.keyringService.signinSso(user.username, "github");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    }
  }

  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "google" })
  google() {
    return "unreachable";
  }
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "google", path: "google/callback" })
  async googleCallback(@Req() req: Req, @Res() res: Res) {
    const user = req.user as GoogleResponse;
    if (req.cookies.path === "/admin") {
      const accessToken = await this.adminService.ssoSigninAdmin(user.emails[0].value, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false });
      res.redirect(`${req.cookies.siteurl}/admin`);
      return;
    }
    const keyring = await this.keyringService.findByAccountId(user.emails[0].value);
    if (!keyring || keyring.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(user.emails[0].value, "google");
      const accessToken = await this.keyringService.generateJwt(signupKeyring, req.account);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}/signup?ssoType=google`);
    } else if (!keyring.verifies.includes("google")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, user.emails[0].value, "google");
      const accessToken = await this.keyringService.generateJwt(myKeyring, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    } else {
      const accessToken = await this.keyringService.signinSso(user.emails[0].value, "google");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    }
  }

  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "facebook" })
  facebook() {
    return "unreachable";
  }
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "facebook", path: "facebook/callback" })
  async facebookCallback(@Req() req: Req, @Res() res: Res) {
    const user = req.user as FacebookResponse;
    if (req.cookies.path === "/admin") {
      const accessToken = await this.adminService.ssoSigninAdmin(user.emails[0].value, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false });
      res.redirect(`${req.cookies.siteurl}/admin`);
      return;
    }
    const keyring = await this.keyringService.findByAccountId(user.emails[0].value);
    if (!keyring || keyring.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(user.emails[0].value, "facebook");
      const accessToken = await this.keyringService.generateJwt(signupKeyring, req.account);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}/signup?ssoType=facebook`);
    } else if (!keyring.verifies.includes("facebook")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, user.emails[0].value, "facebook");
      const accessToken = await this.keyringService.generateJwt(myKeyring, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    } else {
      const accessToken = await this.keyringService.signinSso(user.emails[0].value, "facebook");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    }
  }

  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "apple" })
  apple() {
    return "unreachable";
  }
  @Mutation.Public(() => Boolean, { onlyFor: "restapi", sso: "apple", path: "apple/callback" })
  async appleCallback(@Arg.Body("payload", () => JSON) payload: any): Promise<any> {
    // const sso = this.securityOption.sso.apple as AppleCredential;
    // if (!payload.code || !sso) throw new Error("Invalid Apple SSO");
    // return verifyAppleUser(payload, this.options.origin, sso);
  }

  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "kakao" })
  kakao() {
    return "unreachable";
  }
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "kakao", path: "kakao/callback" })
  async kakaoCallback(@Req() req: Req, @Res() res: Res) {
    const user = req.user as KakaoResponse;
    if (req.cookies.path === "/admin") {
      const accessToken = await this.adminService.ssoSigninAdmin(user.email, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false });
      res.redirect(`${req.cookies.siteurl}/admin`);
      return;
    }
    const keyring = await this.keyringService.findByAccountId(user.email);
    if (!keyring || keyring.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(user.email, "kakao");
      const accessToken = await this.keyringService.generateJwt(signupKeyring, req.account);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}/signup?ssoType=kakao`);
    } else if (!keyring.verifies.includes("kakao")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, user.email, "kakao");
      const accessToken = await this.keyringService.generateJwt(myKeyring, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    } else {
      const accessToken = await this.keyringService.signinSso(user.email, "kakao");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    }
  }

  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "naver" })
  naver() {
    return "unreachable";
  }
  @Query.Public(() => Boolean, { onlyFor: "restapi", sso: "naver", path: "naver/callback" })
  async naverCallback(@Req() req: Req, @Res() res: Res) {
    const user = req.user as NaverResponse;
    if (req.cookies.path === "/admin") {
      const accessToken = await this.adminService.ssoSigninAdmin(user.email, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false });
      res.redirect(`${req.cookies.siteurl}/admin`);
      return;
    }
    const keyring = await this.keyringService.findByAccountId(user.email);
    if (!keyring || keyring.status === "prepare") {
      const signupKeyring = await this.keyringService.signupSso(user.email, "naver");
      const accessToken = await this.keyringService.generateJwt(signupKeyring, req.account);
      res.cookie("signupKeyring", signupKeyring, { httpOnly: false }); //추후에 true로 바꿔야함
      res.cookie("signupToken", accessToken, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}/signup?ssoType=naver`);
    } else if (!keyring.verifies.includes("naver")) {
      const myKeyring = await this.keyringService.signaddSso(keyring.id, user.email, "naver");
      const accessToken = await this.keyringService.generateJwt(myKeyring, req.account);
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    } else {
      const accessToken = await this.keyringService.signinSso(user.email, "naver");
      res.cookie("jwt", accessToken.jwt, { httpOnly: false }); //추후에 true로 바꿔야함
      res.redirect(`${req.cookies.siteurl}`);
    }
  }
  //*====================== SSO Area ======================*//
  //*======================================================*//
}
