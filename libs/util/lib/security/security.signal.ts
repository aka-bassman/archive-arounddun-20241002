import { Account, Arg, JSON, LogSignal, Message, Mutation, Query, Signal, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal({ name: "Security" })
export class SecuritySignal extends LogSignal(Srvs) {
  @Query.Public(() => String, { cache: 3000 })
  ping() {
    return resolve<string>("ping");
  }

  @Query.Public(() => String, { cache: 10000 })
  pingBody(@Arg.Body("data", () => JSON) data: string) {
    return resolve<string>(global.JSON.stringify(data));
  }

  @Query.Public(() => String, { cache: 10000 })
  pingParam(@Arg.Param("id", () => String) id: string) {
    return resolve<string>(id);
  }

  @Query.Public(() => String)
  pingQuery(@Arg.Query("id", () => String) id: string) {
    return resolve<string>(id);
  }

  @Query.Every(() => String)
  pingEvery() {
    return resolve<string>("pingEvery");
  }

  @Query.User(() => String)
  pingUser() {
    return resolve<string>("pingUser");
  }

  @Query.Admin(() => String)
  pingAdmin() {
    return resolve<string>("pingAdmin");
  }

  @Mutation.Public(() => String)
  encrypt(@Arg.Body("data", () => String) data: string) {
    const encrypted = this.securityService.encrypt(data);
    return resolve<string>(encrypted);
  }
  @Mutation.Public(() => cnst.AccessToken)
  updateSignature(
    @Arg.Body("signchain", () => String) signchain: string,
    @Arg.Body("signmessage", () => String) signmessage: string,
    @Arg.Body("signaddress", () => String) signaddress: string,
    @Account() account: Account
  ) {
    const accessToken = this.securityService.updateSignature({ signchain, signmessage, signaddress }, account);
    return resolve<cnst.AccessToken>(accessToken);
  }
  @Mutation.Public(() => Boolean)
  async cleanup() {
    if (process.env.NODE_ENV !== "test") throw new Error("cleanup is only available in test environment");
    await this.securityService.cleanup();
    return resolve<string>(true);
  }
  @Message.Public(() => String)
  wsPing(@Arg.Msg("data", () => String) data: string) {
    return resolve<string>(data);
  }
}
