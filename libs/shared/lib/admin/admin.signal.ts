import { Account, Arg, DbSignal, ID, Me, Mutation, Query, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.Admin)
export class AdminSignal extends DbSignal(cnst.adminCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.SuperAdmin },
}) {
  @Query.Public(() => Boolean)
  async isAdminSystemInitialized() {
    return await this.adminService.isAdminSystemInitialized();
  }

  @Mutation.Public(() => cnst.Admin)
  async createAdminWithInitialize(@Arg.Body("data", () => cnst.AdminInput) data: db.AdminInput) {
    const admin = await this.adminService.createAdminWithInitialize(data);
    return resolve<cnst.Admin>(admin);
  }

  @Query.Admin(() => cnst.Admin)
  async me(@Me() me: Me) {
    const admin = await this.adminService.getAdmin(me.id);
    return resolve<cnst.Admin>(admin);
  }

  @Mutation.Public(() => cnst.util.AccessToken)
  async signinAdmin(
    @Arg.Body("accountId", () => String, { example: "qwer@qwer.com" }) accountId: string,
    @Arg.Body("password", () => String, { example: "qwer1234" }) password: string,
    @Account() account: Account
  ) {
    const accessToken = await this.adminService.signinAdmin(accountId, password, account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }

  @Mutation.Admin(() => cnst.util.AccessToken)
  async signoutAdmin(@Account() account: Account) {
    const accessToken = await this.adminService.signoutAdmin(account);
    return resolve<cnst.util.AccessToken>(accessToken);
  }

  @Mutation.Admin(() => cnst.Admin)
  async addAdminRole(
    @Arg.Param("adminId", () => ID) adminId: string,
    @Arg.Body("role", () => String) role: cnst.AdminRole,
    @Me() me: Me
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (me.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    const admin = await this.adminService.addRole(adminId, role);
    return resolve<cnst.Admin>(admin);
  }

  @Mutation.Admin(() => cnst.Admin)
  async subAdminRole(
    @Arg.Param("adminId", () => ID) adminId: string,
    @Arg.Body("role", () => String) role: cnst.AdminRole,
    @Me() me: Me
  ) {
    const level = cnst.adminRoles.findIndex((r) => r === role);
    if (me.roles.every((adminRole) => cnst.adminRoles.findIndex((r) => r === adminRole) < level))
      throw new Error("Not Allowed");
    const admin = await this.adminService.subRole(adminId, role);
    return resolve<cnst.Admin>(admin);
  }
}
