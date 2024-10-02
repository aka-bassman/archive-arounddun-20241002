import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";

describe("Prompt Signal", () => {
  describe("Prompt Service", () => {
    let adminAgent: userSpec.AdminAgent;
    let userAgent: userSpec.UserAgent;
    let prompt: cnst.Prompt;
    beforeAll(async () => {
      // adminAgent = await adminSpec.getAdminAgentWithInitialize();
      // userAgent = await userSpec.getUserAgentWithPhone();
    });
    it("can create prompt", async () => {
      // prompt = await promptSpec.createPrompt(adminAgent, userAgent);
    });
  });
});
