import { LogSignal, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Summary)
export class SummarySignal extends LogSignal(Srvs) {}
