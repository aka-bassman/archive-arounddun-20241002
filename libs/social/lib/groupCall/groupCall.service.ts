import * as db from "../db";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("GroupCallService")
export class GroupCallService extends DbService(db.groupCallDb) {
  @Srv() protected readonly userService: srv.UserService;

  async joinGroupCall(callId: string, userId: string) {
    const groupCall = await this.groupCallModel.getGroupCall(callId);
    return await groupCall.addUser(userId).save();
  }
  async leaveGroupCall(callId: string, userId: string) {
    const groupCall = await this.groupCallModel.getGroupCall(callId);
    return await groupCall.subUser(userId).save();
  }
  async summarize(): Promise<cnst.GroupCallSummary> {
    return {
      ...(await this.groupCallModel.getSummary()),
    };
  }
}
