import { createNestApp } from "@core/nest";
import { env } from "./env/env.server";
import { registerBatches, registerModules } from "./server";

const bootstrap = async () => {
  const serverMode = process.env.SERVER_MODE as "federation" | "batch" | "all" | null;
  if (!serverMode) throw new Error("SERVER_MODE environment variable is not defined");
  const app = await createNestApp({ registerModules, registerBatches, serverMode, env });
  return () => app.close();
};
void bootstrap();
