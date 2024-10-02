import { LogSignal, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Setting)
export class SettingSignal extends LogSignal(Srvs) {}
