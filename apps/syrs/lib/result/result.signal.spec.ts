import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createResult = async (adminAgent: userSpec.AdminAgent, userAgent: userSpec.UserAgent) => {
  const resultInput = sampleOf(cnst.ResultInput);
  const result = await adminAgent.fetch.createResult(resultInput);
  return result;
};
