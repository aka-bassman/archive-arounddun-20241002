import { Logger } from "@core/common";
import { LoginForm } from "@core/next";
import { Store, router, scalarStateOf, setAuth } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import type { RootStore } from "../store";

@Store({ name: "shared" })
export class SharedStore extends scalarStateOf("shared" as const, {
  // state
}) {
  async login({ auth, redirect, unauthorize, jwt }: LoginForm) {
    if (jwt) setAuth({ jwt });
    try {
      // 1. Auth Process
      if (auth === "admin") await (this as unknown as RootStore).initAdminAuth();
      else {
        await (this as unknown as RootStore).initUserAuth();
        await (this as unknown as RootStore).whoAmI();
      }
      // 2. Redirect
      if (redirect) router.push(redirect);
    } catch (err) {
      Logger.debug(`Login failed: ${err}`);
      // resetAuth();
      if (unauthorize) router.push(unauthorize);
    }
  }
  async logout() {
    const { jwt } = await fetch.signoutUser();
    setAuth({ jwt });

    this.set({ me: fetch.defaultAdmin as cnst.Admin, myKeyring: fetch.defaultKeyring, self: fetch.defaultUser });
    void (this as unknown as RootStore).whoAmI({ reset: true });
    router.refresh();
  }
}
