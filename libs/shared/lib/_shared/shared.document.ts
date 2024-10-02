import * as cnst from "./shared.constant";
import { Document, Input } from "@core/server";

export class FileMeta extends Document(cnst.FileMeta) {}
export class FileMetaInput extends Input(cnst.FileMeta) {}

export class ExternalLink extends Document(cnst.ExternalLink) {}
export class ExternalLinkInput extends Input(cnst.ExternalLink) {}

export class ServiceReview extends Document(cnst.ServiceReview) {}
export class ServiceReviewInput extends Input(cnst.ServiceReview) {}

export class LeaveInfo extends Document(cnst.LeaveInfo) {}
export class LeaveInfoInput extends Input(cnst.LeaveInfo) {}

export class ChainWallet extends Document(cnst.ChainWallet) {}
export class ChainWalletInput extends Input(cnst.ChainWallet) {}
