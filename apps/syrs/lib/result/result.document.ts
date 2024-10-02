/* eslint-disable @nx/workspace/noImportExternalLibrary */
import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.ResultInput)
export class ResultInput extends Input(cnst.ResultInput) {}

@Database.Document(() => cnst.Result)
export class Result extends Document(cnst.Result) {}

@Database.Model(() => cnst.Result)
export class ResultModel extends Model(Result, cnst.resultCnst) {
  async getSummary(): Promise<cnst.ResultSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Result)
export class ResultMiddleware extends Middleware(ResultModel, Result) {
  onSchema(schema: SchemaOf<ResultModel, Result>) {
    // schema.index({ status: 1 })
  }
}
