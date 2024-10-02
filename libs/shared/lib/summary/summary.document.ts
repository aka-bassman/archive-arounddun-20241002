import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";
import { getPeriodicType } from "@core/common";

@Database.Input(() => cnst.SummaryInput)
export class SummaryInput extends Input(cnst.SummaryInput) {}

@Database.Document(() => cnst.Summary)
export class Summary extends Document(cnst.Summary) {}

@Database.Model(() => cnst.Summary)
export class SummaryModel extends Model(Summary, cnst.summaryCnst) {
  async archive(archiveType: "periodic" | "non-periodic", data: Omit<SummaryInput, "type">) {
    const [type, at] = getPeriodicType();
    if ((await this.Summary.countDocuments({ status: "active" })) > 1) {
      const summary = await this.Summary.pickOne({ status: "active" });
      await this.Summary.deleteMany({ status: "active", _id: { $ne: summary._id } });
    }
    await this.Summary.updateOne(
      { status: "active", type: "active" },
      { ...data, type: "active", at, status: "active" },
      { upsert: true }
    );
    if (archiveType === "non-periodic") return await new this.Summary(data).save();
    await this.Summary.updateOne(
      { status: "archived", type, at },
      { ...data, type, at, status: "archived" },
      { upsert: true }
    );
    return await this.Summary.pickOne({ status: "archived", type, at });
  }
}

@Database.Middleware(() => cnst.Summary)
export class SummaryMiddleware extends Middleware(SummaryModel, Summary) {
  onSchema(schema: SchemaOf<SummaryModel, Summary>) {
    // schema.index({ status: 1 })
  }
}
