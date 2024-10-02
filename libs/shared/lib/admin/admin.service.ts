import * as db from "../db";
import { Account } from "@core/base";
import { DbService, Service, Srv, Use } from "@core/server";
import { cnst } from "../cnst";
import { isPasswordMatch } from "@shared/nest";
import type * as option from "../option";
import type * as srv from "../srv";

@Service("AdminService")
export class AdminService extends DbService(db.adminDb) {
  @Use() protected readonly rootAdminInfo: option.AccountInfo;
  @Srv() protected readonly securityService: srv.util.SecurityService;

  async onModuleInit() {
    const rootAdmin =
      (await this.adminModel.findByAccountId(this.rootAdminInfo.accountId)) ??
      (await this.adminModel.createAdmin(this.rootAdminInfo));
    await rootAdmin.set({ roles: ["admin", "superAdmin"], password: this.rootAdminInfo.password }).save();
  }
  async isAdminSystemInitialized() {
    return await this.adminModel.hasAnotherAdmin(this.rootAdminInfo.accountId);
  }
  async createAdminWithInitialize(data: db.AdminInput) {
    if (await this.isAdminSystemInitialized()) throw new Error("Admin System Already Initialized");
    const admin = await this.adminModel.createAdmin(data);
    return await admin.set({ roles: ["admin", "superAdmin"] }).save();
  }
  async signinAdmin(accountId: string, password: string, account?: Account) {
    const adminSecret = await this.adminModel.getAdminSecret(accountId);
    if (adminSecret.status !== "active" || !(await isPasswordMatch(password, adminSecret.password || "")))
      throw new Error(`not match`);
    const admin = await this.adminModel.getAdmin(adminSecret.id);
    void admin.updateAccess().save();
    return this.securityService.generateJwt({ admin, account });
  }
  async signoutAdmin(account: Account) {
    if (!account.me) throw new Error("No Admin Account");
    const admin = await this.adminModel.getAdmin(account.me.id);
    void admin.updateAccess().save();
    return this.securityService.generateJwt({ keyring: account.myKeyring, user: account.self });
  }
  async ssoSigninAdmin(accountId: string, account?: Account) {
    const admin = await this.adminModel.pickByAccountId(accountId);
    void admin.updateAccess().save();
    return this.securityService.generateJwt({ admin, account });
  }
  async addRole(adminId: string, role: cnst.AdminRole) {
    const admin = await this.adminModel.getAdmin(adminId);
    return await admin.addRole(role).save();
  }
  async subRole(adminId: string, role: cnst.AdminRole) {
    const admin = await this.adminModel.getAdmin(adminId);
    return await admin.subRole(role).save();
  }
  async summarize(): Promise<cnst.AdminSummary> {
    return {
      ...(await this.adminModel.getSummary()),
    };
  }
}
