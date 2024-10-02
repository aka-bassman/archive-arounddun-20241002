import fs from "fs";
interface MakeDockerParams {
  workspaceRoot: string;
  projectName: string;
}
export const makeDocker = (
  type: "backend" | "frontend",
  branch: "debug" | "develop" | "main",
  { workspaceRoot, projectName }: MakeDockerParams
) => {
  const dockerfileStr = `FROM node:20.17.0-alpine
RUN ln -sf /usr/share/zoneinfo/Asia/Seoul /etc/localtime
RUN apk --no-cache add git

${
  type === "backend"
    ? `RUN apk --no-cache add mongodb-tools
    RUN apk add --update redis
    RUN apk add --no-cache build-base python3
`
    : ""
}RUN mkdir -p /workspace
WORKDIR /workspace
COPY ./package.json ./package.json
RUN npx pnpm i --prod
COPY . .
ENV PORT ${type === "backend" ? "8080" : "4200"}
ENV NODE_OPTIONS=--max_old_space_size=8192
ENV NEXT_PUBLIC_APP_NAME=${projectName}
ENV NEXT_PUBLIC_ENV=${branch}
ENV NEXT_PUBLIC_OPERATION_MODE=cloud
CMD ${type === "backend" ? `["node", "main.js"]` : "npm start"}`;
  fs.writeFileSync(`${workspaceRoot}/dist/apps/${projectName}/${type}/Dockerfile`, dockerfileStr);
};
// RUN apk --no-cache --virtual build-dependencies add python make g++
