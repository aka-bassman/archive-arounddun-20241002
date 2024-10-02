import { option as util } from "@util/server";

export { option as util } from "@util/server";

export interface AccountInfo {
  accountId: string;
  password: string;
}

export type ModulesOptions = util.ModulesOptions & {
  rootAdminInfo: AccountInfo;
};
