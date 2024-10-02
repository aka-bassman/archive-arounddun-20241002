import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";

describe("Result Signal", () => {
  describe("Result Service", () => {
    let adminAgent: userSpec.AdminAgent;
    let userAgent: userSpec.UserAgent;
    let result: cnst.Result;
    beforeAll(async () => {
      // adminAgent = await adminSpec.getAdminAgentWithInitialize();
      // userAgent = await userSpec.getUserAgentWithPhone();
    });
    it("can create result", async () => {
      // result = await resultSpec.createResult(adminAgent, userAgent);
    });
  });
});
