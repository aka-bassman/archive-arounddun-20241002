import * as cnst from "./syrs.constant";
import { Document, Input } from "@core/server";

export class Airdata extends Document(cnst.Airdata) {}
export class AirdataInput extends Input(cnst.Airdata) {}
