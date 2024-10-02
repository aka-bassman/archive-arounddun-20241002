import { AddDocument, AddInput, AddModel, Database, Middleware, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { db as shared } from "@shared/server";

@Database.Input(() => cnst.SummaryInput)
export class SummaryInput extends AddInput(shared.summaryDb.Input, cnst.SummaryInput) {}

@Database.Document(() => cnst.Summary)
export class Summary extends AddDocument(shared.summaryDb.Doc, cnst.Summary) {}

@Database.Model(() => cnst.Summary)
export class SummaryModel extends AddModel(shared.summaryDb.Model, cnst.summaryCnst) {}

@Database.Middleware(() => cnst.Summary)
export class SummaryMiddleware extends Middleware(SummaryModel, Summary) {
  onSchema(schema: SchemaOf<SummaryModel, Summary>) {
    //
  }
}
