import * as cnst from "./util.constant";
import { Document, Input } from "@core/server";

export class AccessToken extends Document(cnst.AccessToken) {}
export class AccessTokenInput extends Input(cnst.AccessToken) {}

export class AccessLog extends Document(cnst.AccessLog) {}
export class AccessLogInput extends Input(cnst.AccessLog) {}

export class Coordinate extends Document(cnst.Coordinate) {}
export class CoordinateInput extends Input(cnst.Coordinate) {}

export class AccessStat extends Document(cnst.AccessStat) {}
export class AccessStatInput extends Input(cnst.AccessStat) {}
