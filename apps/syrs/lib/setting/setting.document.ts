import { AddDocument, AddInput, Database, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { db as shared } from "@shared/server";

@Database.Input(() => cnst.SettingInput)
export class SettingInput extends AddInput(shared.settingDb.Input, cnst.SettingInput) {}

@Database.Document(() => cnst.Setting)
export class Setting extends AddDocument(shared.settingDb.Doc, cnst.Setting) {}

@Database.Model(() => cnst.Setting)
export class SettingModel extends Model(Setting, cnst.settingCnst) {}

@Database.Middleware(() => cnst.Setting)
export class SettingMiddleware extends Middleware(SettingModel, Setting) {
  onSchema(schema: SchemaOf<SettingModel, Setting>) {
    //
  }
}
