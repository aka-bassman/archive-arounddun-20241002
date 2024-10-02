import * as userSpec from "@syrs/lib/user/user.signal.spec";
import { cnst } from "../cnst";
import { sampleOf } from "@core/common";

export const createPrompt = async (adminAgent: userSpec.AdminAgent, userAgent: userSpec.UserAgent) => {
  const promptInput = sampleOf(cnst.PromptInput);
  const prompt = await adminAgent.fetch.createPrompt(promptInput);
  return prompt;
};
