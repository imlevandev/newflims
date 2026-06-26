import { bootstrap } from "./app/bootstrap";
import { logger } from "./config/logger";

void bootstrap().catch((error) => {
  logger.error("Bot failed to start", { error });
  process.exit(1);
});
