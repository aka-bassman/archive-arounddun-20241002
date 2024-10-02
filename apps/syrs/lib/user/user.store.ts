import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { dayjs } from "@core/base";
import { fetch, userGql } from "../fetch";

@Store(() => cnst.User)
export class UserStore extends stateOf(userGql, {
  self: fetch.defaultUser as cnst.User,
}) {
  async whoAmI({ reset }: { reset?: boolean } = {}) {
    this.set({ self: reset ? (fetch.defaultUser as cnst.User) : ((await fetch.whoAmI()) as cnst.User) });
  }
  async restrictUser(id: string, restrictReason: string, restrictHour?: number) {
    const user = (await fetch.restrictUser(
      id,
      restrictReason,
      restrictHour ? dayjs().add(restrictHour, "hour") : undefined
    )) as cnst.User;
    this.setUser(user);
  }
  async releaseUser(id: string) {
    const user = (await fetch.releaseUser(id)) as cnst.User;
    this.setUser(user);
  }
  async updateUserForPrepare(keyringId: string) {
    const { userForm } = this.pick("userForm");
    const purifyUser = fetch.purifyUser(userForm);
    if (!purifyUser) return;
    const user = await fetch.updateUserForPrepare(keyringId, { ...purifyUser });
    this.set({ self: user as cnst.User });
  }
}
