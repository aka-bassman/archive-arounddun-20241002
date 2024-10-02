import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.SettingInput)
export class SettingInput extends Input(cnst.SettingInput) {}

@Database.Document(() => cnst.Setting)
export class Setting extends Document(cnst.Setting) {}

@Database.Model(() => cnst.Setting)
export class SettingModel extends Model(Setting, cnst.settingCnst) {}

@Database.Middleware(() => cnst.Setting)
export class SettingMiddleware extends Middleware(SettingModel, Setting) {
  onSchema(schema: SchemaOf<SettingModel, Setting>) {
    // schema.index({ status: 1 })
  }
}
