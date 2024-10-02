import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { type Dayjs, dayjs } from "@core/base";
import { cnst } from "../cnst";

@Database.Input(() => cnst.UserInput)
export class UserInput extends Input(cnst.UserInput) {}

@Database.Document(() => cnst.User)
export class User extends Document(cnst.User) {
  addRole(role: cnst.UserRole) {
    if (!this.roles.includes(role)) this.roles = [...this.roles, role];
    void (this.constructor as UserModel["User"]).addSummary(role);
    return this;
  }
  subRole(role: cnst.UserRole) {
    this.roles = this.roles.filter((r) => r !== role);
    void (this.constructor as UserModel["User"]).subSummary(role);
    return this;
  }
  addRequestRole(role: cnst.UserRole) {
    if (!this.requestRoles.includes(role)) this.requestRoles = [...this.requestRoles, role];
    return this;
  }
  subRequestRole(role: cnst.UserRole) {
    this.requestRoles = this.requestRoles.filter((r) => r !== role);
    return this;
  }
  setJourneyStatus(journeyStatus: cnst.JourneyStatus) {
    this.journeyStatus = journeyStatus;
    this.journeyStatusAt = dayjs();
    return this;
  }
  setInquiryStatus(inquiryStatus: cnst.InquiryStatus) {
    this.inquiryStatus = inquiryStatus;
    this.inquiryStatusAt = dayjs();
    return this;
  }
  restrict(restrictReason: string, restrictUntil?: Dayjs) {
    void (this.constructor as UserModel["User"]).moveSummary(this.status, "restricted");
    this.status = "restricted";
    this.restrictReason = restrictReason;
    this.restrictUntil = restrictUntil;
    return this;
  }
  release() {
    if (this.status !== "restricted") throw new Error("User is not restricted");
    void (this.constructor as UserModel["User"]).moveSummary(this.status, "active");
    this.status = "active";
    this.restrictReason = undefined;
    this.restrictUntil = undefined;
    return this;
  }
}

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
    schema.pre<User>("save", function (next) {
      if (this.isModified("images")) {
        this.imageNum = this.images.length;
        if (["approved", "reserved", "rejected"].includes(this.profileStatus)) this.profileStatus = "applied";
        else if (this.profileStatus === "active") this.profileStatus = "prepare";
      }
      next();
    });
  }
}
