import { Arg, DbSignal, Mutation, Query, Self, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";
import type * as db from "../db";

@Signal(() => cnst.GroupCall)
export class GroupCallSignal extends DbSignal(cnst.groupCallCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Public },
}) {
  @Mutation.Public(() => cnst.GroupCall)
  async createGroupCall(
    @Arg.Body("data", () => cnst.GroupCallInput) data: db.GroupCallInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    const groupCall =
      (await this.groupCallService.findByRoom(data.roomId)) ?? (await this.groupCallService.createGroupCall(data));
    return resolve<cnst.GroupCall>(groupCall);
  }
}
