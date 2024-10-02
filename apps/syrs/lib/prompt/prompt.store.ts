import { Store, stateOf } from "@core/client";
import { cnst } from "../cnst";
import { fetch } from "../fetch";

@Store(() => cnst.Prompt)
export class PromptStore extends stateOf(fetch.promptGql, {
  // state
}) {
  // action
  async setPromptDefault() {
    const prompt = await fetch.setPromptDefault();
    this.setPrompt(prompt);
  }
}
