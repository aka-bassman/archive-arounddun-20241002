import { ChatSignal } from "./chat.signal";
import { SocialService } from "./social.service";
import { allSrvs } from "../srv";
import { batchModuleOf, scalarModuleOf } from "@core/server";

export const registerSocialScalarModule = () => scalarModuleOf({ signals: [ChatSignal], uses: {} }, allSrvs);

export const registerSocialBatchModule = () => batchModuleOf({ service: SocialService, uses: {} });
