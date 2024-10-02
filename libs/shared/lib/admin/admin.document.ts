import { Database, Document, Input, Loader, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { dayjs } from "@core/base";
import { hashPassword } from "@shared/nest";

@Database.Input(() => cnst.AdminInput)
export class AdminInput extends Input(cnst.AdminInput) {}

@Database.Document(() => cnst.Admin)
export class Admin extends Document(cnst.Admin) {
  addRole(role: cnst.AdminRole) {
    if (!this.roles.includes(role)) this.roles = [...this.roles, role];
    return this;
  }
  subRole(role: cnst.AdminRole) {
    this.roles = this.roles.filter((r) => r !== role);
    return this;
  }
  updateAccess() {
    this.lastLoginAt = dayjs();
    return this;
  }
}

@Database.Model(() => cnst.Admin)
export class AdminModel extends Model(Admin, cnst.adminCnst) {
  @Loader.ByField("accountId") adminAccountIdLoader: Loader<string, Admin>;

  async hasAnotherAdmin(accountId: string) {
    const exists = await this.Admin.exists({ accountId: { $ne: accountId }, status: "active" });
    return !!exists;
  }
  async getAdminSecret(accountId: string): Promise<{ id: string; status: string; roles: string[]; password: string }> {
    const adminSecret = await this.Admin.findOne({ accountId }).select({ status: true, roles: true, password: true });
    if (!adminSecret) throw new Error("No Account");
    return adminSecret as { id: string; status: string; roles: string[]; password: string };
  }
  async getSummary(): Promise<cnst.AdminSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.Admin)
export class AdminMiddleware extends Middleware(AdminModel, Admin) {
  onSchema(schema: SchemaOf<AdminModel, Admin>) {
    schema.pre<Admin>("save", async function (next) {
      if (!this.isModified("password") || !this.password) {
        next();
        return;
      }
      const encryptedPassword = await hashPassword(this.password);
      this.password = encryptedPassword;
      next();
    });
    schema.index({ accountId: "text" });
  }
}
