import type { Client } from "discord.js";

import { logger } from "../config/logger";
import type { BotEvent } from "../shared/types/bot-event";

export const readyEvent: BotEvent<"clientReady"> = {
  name: "clientReady",
  once: true,
  async execute(client: Client<true>) {
    logger.info(`Bot logged in as ${client.user.tag}`);
  },
};
