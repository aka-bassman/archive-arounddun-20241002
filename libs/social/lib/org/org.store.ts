import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { msg } from "../dict";

@Store(() => cnst.Org)
export class OrgStore extends stateOf(fetch.orgGql, {}) {
  async inviteOwnerFromOrg(email: string) {
    const { org } = this.pick("org");
    msg.loading("org.inviteMemberLoading", { key: "inviteOwnerFromOrg" });
    this.set({ org: await fetch.inviteOwnerFromOrg(org.id, email) });
    msg.success("org.inviteMemberSuccess", { key: "inviteOwnerFromOrg" });
  }
  async inviteOperatorFromOrg(email: string) {
    const { org } = this.pick("org");
    msg.loading("org.inviteMemberLoading", { key: "inviteOperatorFromOrg" });
    this.set({ org: await fetch.inviteOperatorFromOrg(org.id, email) });
    msg.success("org.inviteMemberSuccess", { key: "inviteOperatorFromOrg" });
  }
  async inviteViewerFromOrg(email: string) {
    const { org } = this.pick("org");
    msg.loading("org.inviteMemberLoading", { key: "inviteViewerFromOrg" });
    this.set({ org: await fetch.inviteViewerFromOrg(org.id, email) });
    msg.success("org.inviteMemberSuccess", { key: "inviteViewerFromOrg" });
  }
  async removeUserFromOrg(userId: string) {
    const { self } = this.get() as unknown as { self: cnst.User };
    if (self.id === userId) {
      msg.error("org.removeSelfError");
      return;
    }
    const { org } = this.pick("org");
    this.set({ org: await fetch.removeUserFromOrg(org.id, userId) });
  }
  async removeEmailFromOrg(email: string) {
    const { org } = this.pick("org");
    this.set({ org: await fetch.removeEmailFromOrg(org.id, email) });
  }
}
