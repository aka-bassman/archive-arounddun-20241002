import * as db from "../db";
import { DbService, Service, Srv } from "@core/server";
import { cnst } from "../cnst";
import type * as srv from "../srv";

@Service("ImageHostingService")
export class ImageHostingService extends DbService(db.imageHostingDb) {
  // @Use() protected readonly injectedVar: string;
  // @Srv() protected readonly otherService: srv.OtherService;
  @Srv() protected readonly fileService: srv.shared.FileService;

  async summarize(): Promise<cnst.ImageHostingSummary> {
    return {
      ...(await this.imageHostingModel.getSummary()),
    };
  }
}
