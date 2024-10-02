import * as db from "../db";
import { DbService, Service, Srv, Use } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";
import type { GmailApi } from "@util/nest";

@Service("OrgService")
export class OrgService extends DbService(db.orgDb) {
  @Use() protected readonly origin: string;
  @Srv() protected readonly userService: srv.UserService;
  @Srv() protected readonly keyringService: srv.shared.KeyringService;
  @Srv() protected readonly securityService: srv.util.SecurityService;
  @Use() protected readonly gmailApi: GmailApi;

  async inviteOwnerFromOrg(orgId: string, email: string, keyringId: string) {
    const keyring = await this.keyringService.getKeyring(keyringId);
    const user = await this.userService.getUser(keyring.user);
    const org = await this.orgModel.getOrg(orgId);
    if (!org.owners.includes(user.id)) throw new Error("not owner");
    const invitee = await this.keyringService.accountIdLoad(email);
    const inviteRequest = org.makeInviteRequest(email, "owner", user);
    const inviteSignature = this.securityService.sign(inviteRequest);
    await this.gmailApi.sendMail(org.getInvitationMail(inviteRequest, inviteSignature, this.origin));
    if (invitee) await org.addOwnerInvite(invitee.user).save();
    else await org.addOwnerInviteEmail(email).save();
    return org;
  }
  async inviteOperatorFromOrg(orgId: string, email: string, keyringId: string) {
    const keyring = await this.keyringService.getKeyring(keyringId);
    const user = await this.userService.getUser(keyring.user);
    const org = await this.orgModel.getOrg(orgId);
    if (!org.owners.includes(user.id)) throw new Error("not owner");
    const invitee = await this.keyringService.accountIdLoad(email);
    const inviteRequest = org.makeInviteRequest(email, "operator", user);
    const inviteSignature = this.securityService.sign(inviteRequest);
    await this.gmailApi.sendMail(org.getInvitationMail(inviteRequest, inviteSignature, this.origin));
    if (invitee) await org.addOperatorInvite(invitee.user).save();
    else await org.addOperatorInviteEmail(email).save();
    return org;
  }
  async inviteViewerFromOrg(orgId: string, email: string, keyringId: string) {
    const keyring = await this.keyringService.getKeyring(keyringId);
    const user = await this.userService.getUser(keyring.user);
    const org = await this.orgModel.getOrg(orgId);
    if (!org.owners.includes(user.id)) throw new Error("not owner");
    const invitee = await this.keyringService.accountIdLoad(email);
    const inviteRequest = org.makeInviteRequest(email, "viewer", user);
    const inviteSignature = this.securityService.sign(inviteRequest);
    await this.gmailApi.sendMail(org.getInvitationMail(inviteRequest, inviteSignature, this.origin));
    if (invitee) await org.addViewerInvite(invitee.user).save();
    else await org.addViewerInviteEmail(email).save();
    return org;
  }
  async acceptInviteFromOrg(orgId: string, keyringId: string) {
    const org = await this.orgModel.getOrg(orgId);
    const keyring = await this.keyringService.getKeyring(keyringId);
    return await org.acceptInvite(keyring).save();
  }
  async removeUserFromOrg(orgId: string, userId: string, keyringId: string) {
    const org = await this.orgModel.getOrg(orgId);
    const keyring = await this.keyringService.getKeyring(keyringId);
    if (userId === keyring.user) throw new Error("cannot remove self");
    if (!org.owners.includes(keyring.user)) throw new Error("not owner");
    return await org.removeUser(userId).removeInvite(userId).save();
  }
  async removeEmailFromOrg(orgId: string, email: string, keyringId: string) {
    const org = await this.orgModel.getOrg(orgId);
    const keyring = await this.keyringService.getKeyring(keyringId);
    if (!org.owners.includes(keyring.user)) throw new Error("not owner");
    return await org.removeInviteEmail(email).save();
  }
  async summarize(): Promise<cnst.OrgSummary> {
    return {
      ...(await this.orgModel.getSummary()),
    };
  }
}
