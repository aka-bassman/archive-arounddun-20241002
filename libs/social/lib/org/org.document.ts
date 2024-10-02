import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import type * as db from "../db";
@Database.Input(() => cnst.OrgInput)
export class OrgInput extends Input(cnst.OrgInput) {}

@Database.Document(() => cnst.Org)
export class Org extends Document(cnst.Org) {
  getUserIds() {
    return [...this.owners, ...this.operators, ...this.viewers];
  }
  hasUser(userId: string) {
    return this.owners.includes(userId) || this.operators.includes(userId) || this.viewers.includes(userId);
  }
  hasInvitation(keyring: db.shared.Keyring) {
    if (!keyring.accountId || !keyring.user) return false;
    return (
      this.ownerInvites.includes(keyring.user) ||
      this.operatorInvites.includes(keyring.user) ||
      this.viewerInvites.includes(keyring.user) ||
      this.ownerInviteEmails.includes(keyring.accountId) ||
      this.operatorInviteEmails.includes(keyring.accountId) ||
      this.viewerInviteEmails.includes(keyring.accountId)
    );
  }
  removeUser(userId: string) {
    this.owners = this.owners.filter((id) => id !== userId);
    this.operators = this.operators.filter((id) => id !== userId);
    this.viewers = this.viewers.filter((id) => id !== userId);
    if (!this.prevUsers.includes(userId)) this.prevUsers = [...this.prevUsers, userId];
    return this;
  }
  removeInvite(userId: string) {
    this.ownerInvites = this.ownerInvites.filter((id) => id !== userId);
    this.operatorInvites = this.operatorInvites.filter((id) => id !== userId);
    this.viewerInvites = this.viewerInvites.filter((id) => id !== userId);
    return this;
  }
  removeInviteEmail(email: string) {
    this.ownerInviteEmails = this.ownerInviteEmails.filter((e) => e !== email);
    this.operatorInviteEmails = this.operatorInviteEmails.filter((e) => e !== email);
    this.viewerInviteEmails = this.viewerInviteEmails.filter((e) => e !== email);
    return this;
  }
  addOwnerInvite(userId: string) {
    if (this.hasUser(userId)) throw new Error("user already exists");
    this.removeInvite(userId);
    if (this.prevUsers.includes(userId)) this.owners = [...new Set([...this.owners, userId])];
    else this.ownerInvites = [...this.ownerInvites, userId];
    return this;
  }
  addOwnerInviteEmail(email: string) {
    this.removeInviteEmail(email);
    this.ownerInviteEmails = [...this.ownerInviteEmails, email];
    return this;
  }
  addOperatorInvite(userId: string) {
    if (this.hasUser(userId)) throw new Error("user already exists");
    this.removeInvite(userId);
    if (this.prevUsers.includes(userId)) this.operators = [...new Set([...this.operators, userId])];
    else this.operatorInvites = [...this.operatorInvites, userId];
    return this;
  }
  addOperatorInviteEmail(email: string) {
    this.removeInviteEmail(email);
    this.operatorInviteEmails = [...this.operatorInviteEmails, email];
    return this;
  }
  addViewerInvite(userId: string) {
    if (this.hasUser(userId)) throw new Error("user already exists");
    this.removeInvite(userId);
    if (this.prevUsers.includes(userId)) this.viewers = [...new Set([...this.viewers, userId])];
    else this.viewerInvites = [...this.viewerInvites, userId];
    return this;
  }
  addViewerInviteEmail(email: string) {
    this.removeInviteEmail(email);
    this.viewerInviteEmails = [...this.viewerInviteEmails, email];
    return this;
  }
  acceptInvite(keyring: db.shared.Keyring) {
    if (this.hasUser(keyring.user)) throw new Error("user already exists");
    else if (!this.hasInvitation(keyring)) throw new Error("invitation not exists");
    else if (!keyring.accountId || !keyring.user) throw new Error("invalid keyring");
    else if (this.ownerInviteEmails.includes(keyring.accountId) || this.ownerInvites.includes(keyring.user))
      this.owners = [...this.owners, keyring.user];
    else if (this.operatorInviteEmails.includes(keyring.accountId) || this.operatorInvites.includes(keyring.user))
      this.operators = [...this.operators, keyring.user];
    else if (this.viewerInviteEmails.includes(keyring.accountId) || this.viewerInvites.includes(keyring.user))
      this.viewers = [...this.viewers, keyring.user];
    this.removeInviteEmail(keyring.accountId).removeInvite(keyring.user);
    return this;
  }
  makeInviteRequest(
    email: string,
    as: "owner" | "operator" | "viewer",
    inviter: db.User,
    invitee?: db.User
  ): cnst.InviteRequest {
    return {
      orgId: this.id,
      as,
      inviterId: inviter.id,
      inviterNickname: inviter.nickname,
      inviterKeyringId: inviter.keyring,
      inviteeId: invitee?.id ?? null,
      inviteeEmail: email,
      inviteeKeyringId: invitee?.keyring ?? null,
      until: null,
    };
  }
  getInvitationMail(
    { inviteeEmail, inviterNickname, as }: cnst.InviteRequest,
    inviteSignature: string,
    origin: string
  ) {
    return {
      to: inviteeEmail,
      subject: `Invitation: ${inviterNickname} invties you on organization ${this.name} as ${as}.`,
      html: `
          <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html xmlns="http://www.w3.org/1999/xhtml">
              <body>
                <div>${inviterNickname} invties you on organization ${this.name} as ${as}.</div>
                <div>Visit here to sign : ${origin}/invite?inviteSignature=${inviteSignature}</div>
              </body>
          </html>
          `,
    };
  }
}

@Database.Model(() => cnst.Org)
export class OrgModel extends Model(Org, cnst.orgCnst) {
  async getSummary(): Promise<cnst.OrgSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Org)
export class OrgMiddleware extends Middleware(OrgModel, Org) {
  onSchema(schema: SchemaOf<OrgModel, Org>) {
    // schema.index({ status: 1 })
  }
}
