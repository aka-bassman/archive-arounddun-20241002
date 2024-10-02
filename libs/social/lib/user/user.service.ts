import * as db from "../db";
import { ExtendedUserService, Service } from "@core/server";
import { cnst } from "../cnst";
import { srv as shared } from "@shared/server";

@Service("UserService")
export class UserService extends ExtendedUserService(db.userDb, shared.UserService) {
  async summarizeSocial(): Promise<cnst.SocialUserSummary> {
    return {
      ...(await this.userModel.getSummary()),
    };
  }
}
