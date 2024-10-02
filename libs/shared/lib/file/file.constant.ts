import { BaseFilter, BaseModel, Dayjs, Field, Filter, Full, Int, Light, Model, ProtoFile, dayjs } from "@core/base";

export const fileStatuses = ["active", "uploading"] as const;
export type FileStatus = (typeof fileStatuses)[number];

@Model.Input("FileInput")
export class FileInput {
  @Field.Prop(() => String)
  filename: string;

  @Field.Prop(() => String)
  mimetype: string;

  @Field.Prop(() => String)
  encoding: string;

  @Field.Prop(() => [Int], { nullable: true, default: [0, 0] })
  imageSize: [number, number];

  @Field.Prop(() => String, { nullable: true, default: "" })
  url: string;

  @Field.Prop(() => String, { nullable: true })
  abstractData: null | string;

  @Field.Prop(() => Int, { default: 0 })
  size: number;

  @Field.Prop(() => String, { nullable: true })
  origin: null | string;
}
@Model.Object("FileObject")
export class FileObject extends BaseModel(FileInput) implements ProtoFile {
  @Field.Prop(() => Date, { default: () => dayjs() })
  lastModifiedAt: Dayjs;

  @Field.Prop(() => Int, { nullable: true })
  progress: null | number;

  @Field.Prop(() => String, { enum: fileStatuses, default: "uploading" })
  status: FileStatus;
}
@Model.Light("LightFile")
export class LightFile extends Light(FileObject, [
  "filename",
  "imageSize",
  "url",
  "size",
  "abstractData",
  "status",
] as const) {
  getFileSizeStr() {
    const size = this.size;
    if (size < 1024) return `1 KB`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
    if (size < 1024 * 1024 * 1024) return `${(size / 1024 / 1024).toFixed(2)} MB`;
    if (size < 1024 * 1024 * 1024 * 1024) return `${(size / 1024 / 1024 / 1024).toFixed(2)} GB`;
    return `${(size / 1024 / 1024 / 1024 / 1024).toFixed(2)} TB`;
  }
}

@Model.Full("File")
export class File extends Full(FileObject, LightFile) {}

@Model.Insight("FileInsight")
export class FileInsight {
  @Field.Prop(() => Int, { default: 0, accumulate: { $sum: 1 } })
  count: number;
}

@Model.Summary("FileSummary")
export class FileSummary {
  @Field.Prop(() => Int, { min: 0, default: 0, query: {} })
  totalFile: number;
}

@Model.Filter("FileFilter")
export class FileFilter extends BaseFilter(File, {}) {
  @Filter.Mongo()
  byFilename(@Filter.Arg("filename", () => String) filename: string) {
    return { filename };
  }
  @Filter.Mongo()
  byOrigin(@Filter.Arg("origin", () => String) origin: string) {
    return { origin, status: "active" };
  }
}
