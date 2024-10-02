import { LogSignal, Signal } from "@core/base";
import { Srvs } from "../cnst";

@Signal({ name: "LocalFile" })
export class LocalFileSignal extends LogSignal(Srvs) {}
