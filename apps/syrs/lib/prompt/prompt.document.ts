import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.PromptInput)
export class PromptInput extends Input(cnst.PromptInput) {}

@Database.Document(() => cnst.Prompt)
export class Prompt extends Document(cnst.Prompt) {}

@Database.Model(() => cnst.Prompt)
export class PromptModel extends Model(Prompt, cnst.promptCnst) {
  async getSummary(): Promise<cnst.PromptSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
  async getDefaultPrompt(): Promise<Prompt> {
    // return first index of prompt
    const prompt = await this.Prompt.findOne({}).sort({ isDefault: -1, updatedAt: -1 });
    if (!prompt) {
      throw new Error("Prompt not found");
    }
    return prompt;
  }
}

@Database.Middleware(() => cnst.Prompt)
export class PromptMiddleware extends Middleware(PromptModel, Prompt) {
  onSchema(schema: SchemaOf<PromptModel, Prompt>) {
    // schema.index({ status: 1 })
  }
}
