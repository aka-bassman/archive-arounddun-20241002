import * as adminSpec from "@shared/lib/admin/admin.signal.spec";
import * as keyringSpec from "@shared/lib/keyring/keyring.signal.spec";
import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { fetch } from "../fetch";
import { sampleOf } from "@core/common";

export const createImageHosting = async (adminAgent: userSpec.AdminAgent, userAgent: userSpec.UserAgent) => {
  const imageHostingInput = sampleOf(cnst.ImageHostingInput);
  const imageHosting = await adminAgent.fetch.createImageHosting(imageHostingInput);
  return imageHosting;
};
