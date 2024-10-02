import { Account, Arg, Dayjs, DbSignal, ID, Mutation, Query, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.User)
export class UserSignal extends DbSignal(cnst.userCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.User },
}) {
  @Mutation.Every(() => cnst.User)
  async addUserRole(
    @Arg.Param("userId", () => ID) userId: string,
    @Arg.Body("role", () => String) role: cnst.UserRole
  ) {
    const user = await this.userService.addUserRole(userId, role);
    return resolve<cnst.User>(user);
  }
  @Mutation.Admin(() => cnst.User)
  async subUserRole(
    @Arg.Param("userId", () => ID) userId: string,
    @Arg.Body("role", () => String) role: cnst.UserRole
  ) {
    const user = await this.userService.subUserRole(userId, role);
    return resolve<cnst.User>(user);
  }
  @Query.Public(() => ID, { nullable: true })
  async getUserIdHasNickname(@Arg.Query("nickname", () => String) nickname: string) {
    const id = await this.userService.getUserIdHasNickname(nickname);
    return resolve<string>(id);
  }
  @Mutation.Admin(() => cnst.User)
  async restrictUser(
    @Arg.Param("userId", () => ID) userId: string,
    @Arg.Body("restrictReason", () => String) restrictReason: string,
    @Arg.Body("restrictUntil", () => Date, { nullable: true }) restrictUntil: Dayjs | undefined
  ) {
    const user = await this.userService.restrictUser(userId, restrictReason, restrictUntil);
    return resolve<cnst.User>(user);
  }

  @Mutation.Admin(() => cnst.User)
  async releaseUser(@Arg.Param("userId", () => ID) userId: string) {
    const user = await this.userService.releaseUser(userId);
    return resolve<cnst.User>(user);
  }

  @Mutation.Every(() => cnst.User)
  async removeUser(@Arg.Param("userId", () => ID) userId: string, @Account() account: Account) {
    if (!account.me && account.self?.id !== userId) throw new Error("Not authorized");
    const user = await this.userService.removeUser(userId);
    await this.keyringService.removeKeyring(user.keyring);
    return resolve<cnst.User>(user);
  }
  @Mutation.Public(() => cnst.User)
  async updateUserForPrepare(
    @Arg.Param("keyringId", () => ID) keyringId: string,
    @Arg.Body("data", () => cnst.UserInput) data: db.UserInput
  ) {
    const user = await this.userService.updateUserForPrepare(keyringId, data);
    return resolve<cnst.User>(user);
  }
}
