import { Arg, DbSignal, ID, Mutation, Query, Signal, Upload, resolve } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.File)
export class FileSignal extends DbSignal(cnst.fileCnst, Srvs, {
  guards: { get: Query.Public, cru: Mutation.Admin },
}) {
  @Mutation.Public(() => [cnst.File], { onlyFor: "graphql" })
  async addFiles(
    @Arg.Upload("files", () => [Upload]) files: Upload[],
    @Arg.Body("metas", () => [cnst.FileMeta]) metas: cnst.FileMeta[],
    @Arg.Body("type", () => String, { example: "user" }) type: string,
    @Arg.Body("parentId", () => ID, { nullable: true }) parentId: string | null
  ) {
    const fileList = await this.fileService.addFiles(files, metas, type, parentId ?? undefined);
    return resolve<cnst.File[]>(fileList);
  }
  @Mutation.Public(() => [cnst.File], { onlyFor: "restapi" })
  async addFilesRestApi(
    @Arg.Upload("files", () => [Upload]) files: Upload[],
    @Arg.Body("metas", () => String, { example: `[{"lastModifiedAt":"2024-01-14T15:32:47.766Z","size":0}]` })
    metas: string,
    @Arg.Body("type", () => String, { example: "user" }) type: string,
    @Arg.Body("parentId", () => ID, { nullable: true }) parentId: string | null
  ) {
    const fileList = await this.fileService.addFiles(
      files,
      JSON.parse(metas) as cnst.FileMeta[],
      type,
      parentId ?? undefined
    );
    return resolve<cnst.File[]>(fileList);
  }
}
