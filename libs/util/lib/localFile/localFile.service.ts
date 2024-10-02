import { LogService, Service } from "@core/server";

@Service("LocalFileService")
export class LocalFileService extends LogService("LocalFileService") {
  test() {
    return 1;
  }
}
