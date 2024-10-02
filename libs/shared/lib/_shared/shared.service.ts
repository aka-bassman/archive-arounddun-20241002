import { LogService, Service } from "@core/server";

@Service("SharedService")
export class SharedService extends LogService("SharedService") {}
