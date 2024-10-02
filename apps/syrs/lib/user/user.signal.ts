import { LogSignal, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.User)
export class UserSignal extends LogSignal(Srvs) {}
