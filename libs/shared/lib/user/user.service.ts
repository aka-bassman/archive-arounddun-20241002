import * as db from "../db";
import { Dayjs } from "@core/base";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("UserService")
export class UserService extends DbService(db.userDb) {
  @Srv() protected readonly fileService: srv.FileService;

  async generateWithKeyring(keyringId: string, data: Partial<db.User> = {}) {
    return (
      (await this.userModel.findByKeyring(keyringId)) ??
      (await this.userModel.createUser({ nickname: "", keyring: keyringId, roles: ["user"], ...data }))
    );
  }
  async addUserRole(userId: string, role: cnst.UserRole) {
    const user = await this.userModel.getUser(userId);
    return await user.addRole(role).save();
  }
  async subUserRole(userId: string, role: cnst.UserRole) {
    const user = await this.userModel.getUser(userId);
    return await user.subRole(role).save();
  }
  async getUserIdHasNickname(nickname: string) {
    return await this.userModel.findIdByNickname(nickname, "active");
  }
  async restrictUser(userId: string, restrictReason: string, restrictUntil?: Dayjs) {
    const user = await this.userModel.getUser(userId);
    return await user.restrict(restrictReason, restrictUntil).save();
  }
  async releaseUser(userId: string) {
    const user = await this.userModel.getUser(userId);
    return await user.release().save();
  }

  async updateUserForPrepare(keyringId: string, data: db.UserInput) {
    const user = await this.userModel.pickByKeyring(keyringId);
    if (user.profileStatus !== "prepare") throw new Error("User is not in prepare status");
    return await user.set(data).save();
  }
  async summarizeShared(): Promise<cnst.UserSummary> {
    return {
      ...(await this.userModel.getSummary()),
    };
  }
}
