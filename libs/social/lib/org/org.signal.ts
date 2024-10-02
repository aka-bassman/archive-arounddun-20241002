import { Arg, DbSignal, ID, Int, Mutation, MyKeyring, Query, Self, Signal, SortOf, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Org)
export class OrgSignal extends DbSignal(cnst.orgCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Every },
}) {
  @Mutation.Every(() => cnst.Org)
  async createOrg(
    @Arg.Body("data", () => cnst.OrgInput) data: cnst.OrgInput,
    @Self({ nullable: true }) self: Self | null
  ) {
    const org = await this.orgService.createOrg({ ...data, owners: self ? [self.id] : [] });
    return resolve<cnst.Org>(org);
  }

  // * /////////////////////////////////////
  // * Self Slice
  @Query.Every(() => [cnst.Org])
  async orgListInSelf(
    @Arg.Query("skip", () => Int, { nullable: true }) skip: number | null,
    @Arg.Query("limit", () => Int, { nullable: true }) limit: number | null,
    @Arg.Query("sort", () => String, { nullable: true }) sort: SortOf<cnst.OrgFilter> | null,
    @Self() self: Self
  ) {
    const orgs = await this.orgService.listInSelf(self.id, { skip, limit, sort });
    return resolve<cnst.Org[]>(orgs);
  }
  @Query.Every(() => cnst.OrgInsight)
  async orgInsightInSelf(@Self() self: Self) {
    const orgInsight = await this.orgService.insightInSelf(self.id);
    return resolve<cnst.OrgInsight>(orgInsight);
  }
  // * Self Slice
  // * /////////////////////////////////////

  @Query.Public(() => cnst.InviteRequest, { nullable: true })
  getInviteRequest(@Arg.Body("inviteSignature", () => String) inviteSignature: string) {
    const inviteRequest = this.securityService.verify(inviteSignature);
    return resolve<cnst.InviteRequest | null>(inviteRequest);
  }
  @Mutation.User(() => cnst.Org)
  async inviteOwnerFromOrg(
    @Arg.Param("orgId", () => ID) orgId: string,
    @Arg.Body("email", () => String) email: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const org = await this.orgService.inviteOwnerFromOrg(orgId, email, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
  @Mutation.User(() => cnst.Org)
  async inviteOperatorFromOrg(
    @Arg.Param("orgId", () => ID) orgId: string,
    @Arg.Body("email", () => String) email: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const org = await this.orgService.inviteOperatorFromOrg(orgId, email, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
  @Mutation.User(() => cnst.Org)
  async inviteViewerFromOrg(
    @Arg.Param("orgId", () => ID) orgId: string,
    @Arg.Body("email", () => String) email: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const org = await this.orgService.inviteViewerFromOrg(orgId, email, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
  @Mutation.User(() => cnst.Org)
  async acceptInviteFromOrg(@Arg.Param("orgId", () => ID) orgId: string, @MyKeyring() myKeyring: MyKeyring) {
    const org = await this.orgService.acceptInviteFromOrg(orgId, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
  @Mutation.User(() => cnst.Org)
  async removeUserFromOrg(
    @Arg.Param("orgId", () => ID) orgId: string,
    @Arg.Body("userId", () => ID) userId: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const org = await this.orgService.removeUserFromOrg(orgId, userId, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
  @Mutation.User(() => cnst.Org)
  async removeEmailFromOrg(
    @Arg.Param("orgId", () => ID) orgId: string,
    @Arg.Body("email", () => String) email: string,
    @MyKeyring() myKeyring: MyKeyring
  ) {
    const org = await this.orgService.removeEmailFromOrg(orgId, email, myKeyring.id);
    return resolve<cnst.Org>(org);
  }
}
