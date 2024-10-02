import { AddDocument, AddInput, Database, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { db as shared } from "@shared/server";

@Database.Input(() => cnst.UserInput)
export class UserInput extends AddInput(shared.userDb.Input, cnst.UserInput) {}

@Database.Document(() => cnst.User)
export class User extends AddDocument(shared.userDb.Doc, cnst.User) {}

@Database.Model(() => cnst.User)
export class UserModel extends Model(User, cnst.userCnst) {
  async getSummary(): Promise<cnst.UserSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.User)
export class UserMiddleware extends Middleware(UserModel, User) {
  onSchema(schema: SchemaOf<UserModel, User>) {
    //
  }
}
