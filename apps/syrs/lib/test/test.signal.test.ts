import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";

describe("Test Signal", () => {
  describe("Test Service", () => {
    let adminAgent: userSpec.AdminAgent;
    let userAgent: userSpec.UserAgent;
    let test: cnst.Test;
    beforeAll(async () => {
      // adminAgent = await adminSpec.getAdminAgentWithInitialize();
      // userAgent = await userSpec.getUserAgentWithPhone();
    });
    it("can create test", async () => {
      // test = await testSpec.createTest(adminAgent, userAgent);
    });
  });
});
