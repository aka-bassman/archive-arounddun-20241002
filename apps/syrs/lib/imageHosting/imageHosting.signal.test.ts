import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as userSpec from "@syrs/lib/user/user.signal.spec";
import * as imageHostingSpec from "@syrs/lib/imageHosting/imageHosting.signal.spec";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

describe("ImageHosting Signal", () => {
  describe("ImageHosting Service", () => {
    let adminAgent: userSpec.AdminAgent;
    let userAgent: userSpec.UserAgent;
    let imageHosting: cnst.ImageHosting;
    beforeAll(async () => {
      // adminAgent = await adminSpec.getAdminAgentWithInitialize();
      // userAgent = await userSpec.getUserAgentWithPhone();
    });
    it("can create imageHosting", async () => {
      // imageHosting = await imageHostingSpec.createImageHosting(adminAgent, userAgent);
    });
  });
});
