import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.TestInput)
export class TestInput extends Input(cnst.TestInput) {}

@Database.Document(() => cnst.Test)
export class Test extends Document(cnst.Test) {}

@Database.Model(() => cnst.Test)
export class TestModel extends Model(Test, cnst.testCnst) {
  async getSummary(): Promise<cnst.TestSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Test)
export class TestMiddleware extends Middleware(TestModel, Test) {
  onSchema(schema: SchemaOf<TestModel, Test>) {
    // schema.index({ status: 1 })
  }
}