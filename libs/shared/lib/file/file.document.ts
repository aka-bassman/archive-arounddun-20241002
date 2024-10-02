import { Database, Document, Input, Middleware, Model, type SchemaOf } from "@core/server";
import { cnst } from "../cnst";

@Database.Input(() => cnst.FileInput)
export class FileInput extends Input(cnst.FileInput) {}

@Database.Document(() => cnst.File)
export class File extends Document(cnst.File) {}

@Database.Model(() => cnst.File)
export class FileModel extends Model(File, cnst.fileCnst) {
  async progressUpload(id: string, loadSize: number | undefined, totalSize: number) {
    await this.File.updateOne(
      { _id: id },
      { $set: { progress: Math.floor(((loadSize ?? 0) / (totalSize || 1)) * 100) } }
    );
  }
  async finishUpload(id: string, url: string, data: Partial<FileInput>) {
    return this.File.updateOne({ _id: id }, { $set: { ...data, url, progress: 100, status: "active" } });
  }
  async getSummary(): Promise<cnst.FileSummary> {
    return {
      ...(await this.getDefaultSummary()),
    };
  }
}

@Database.Middleware(() => cnst.File)
export class FileMiddleware extends Middleware(FileModel, File) {
  onSchema(schema: SchemaOf<FileModel, File>) {
    schema.index({ filename: "text" });
  }
}
