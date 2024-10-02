import { Store, setAuth, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import type { RootStore } from "../store";

@Store(() => cnst.Admin)
export class AdminStore extends stateOf(fetch.adminGql, {
  me: fetch.defaultAdmin as cnst.Admin,
}) {
  async addAdminRole(adminId: string, role: cnst.AdminRole) {
    const admin = await fetch.addAdminRole(adminId, role);
    const { adminMap } = this.pick("adminMap");
    adminMap.set(admin.id, admin);
    this.set({ adminMap: new Map(adminMap) });
  }
  async subAdminRole(adminId: string, role: cnst.AdminRole) {
    const admin = await fetch.subAdminRole(adminId, role);
    const { adminMap } = this.pick("adminMap");
    adminMap.set(admin.id, admin);
    this.set({ adminMap: new Map(adminMap) });
  }
  async initAdminAuth() {
    const me = await fetch.me();
    this.set({ me });
  }
  async signinAdmin() {
    try {
      const { accountId, password } = this.get().adminForm;
      const jwt = (await fetch.signinAdmin(accountId, password ?? "")).jwt;
      await (this as unknown as RootStore).login({ auth: "admin", jwt });
    } catch (e) {
      //
    }
  }
  async signoutAdmin() {
    const { jwt } = await fetch.signoutAdmin();
    setAuth({ jwt });
    this.set({ me: fetch.defaultAdmin as cnst.Admin, adminForm: fetch.defaultAdmin });
  }
}
