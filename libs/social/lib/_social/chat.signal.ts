import { LogSignal, Signal } from "@core/base";
import { Srvs, cnst } from "../cnst";

@Signal(() => cnst.Chat)
export class ChatSignal extends LogSignal(Srvs) {}
