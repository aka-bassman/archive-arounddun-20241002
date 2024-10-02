import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createTest = async (adminAgent: userSpec.AdminAgent, userAgent: userSpec.UserAgent) => {
  const testInput = sampleOf(cnst.TestInput);
  const test = await adminAgent.fetch.createTest(testInput);
  return test;
};
