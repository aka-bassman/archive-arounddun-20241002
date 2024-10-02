import { Document, Input } from "@core/server";
import { cnst } from "../cnst";

export class StoryStat extends Document(cnst.StoryStat) {}
export class StoryStatInput extends Input(cnst.StoryStat) {}

export class ChatContribution extends Document(cnst.ChatContribution) {}
export class ChatContributionInput extends Input(cnst.ChatContribution) {}

export class CallContribution extends Document(cnst.CallContribution) {}
export class CallContributionInput extends Input(cnst.CallContribution) {}

export class InviteRequest extends Document(cnst.InviteRequest) {}
export class InviteRequestInput extends Input(cnst.InviteRequest) {}
