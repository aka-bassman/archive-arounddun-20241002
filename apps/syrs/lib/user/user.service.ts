import * as db from "../db";
import { ExtendedUserService, MixSrvs, Service } from "@core/server";
import { cnst } from "../cnst";
import { srv as shared } from "@shared/server";
import { srv as social } from "@social/server";

@Service("UserService")
export class UserService extends ExtendedUserService(db.userDb, MixSrvs(shared.UserService, social.UserService)) {
  async summarizeSyrs(): Promise<cnst.SyrsUserSummary> {
    return {
      ...(await this.userModel.getSummary()),
    };
  }
}
