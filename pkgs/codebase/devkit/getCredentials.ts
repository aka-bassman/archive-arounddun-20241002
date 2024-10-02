import fs from "fs";
import yaml from "js-yaml";

type Branch = "debug" | "develop" | "main";
export interface AppSecret { mongo: { account: { user: { username: string; password: string } } } }
type Secret = { [key in Branch]: AppSecret };
interface GetCredentialsParams {
  workspaceRoot: string;
  projectName: string;
  environment: Branch;
}
export const getCredentials = ({ workspaceRoot, projectName, environment }: GetCredentialsParams): AppSecret => {
  const secret = yaml.load(
    fs.readFileSync(`${workspaceRoot}/infra/app/values/${projectName}-secret.yaml`, "utf-8")
  ) as Secret;
  return secret[environment];
};
