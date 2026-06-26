import { Client, GatewayIntentBits } from "discord.js";

import { logger } from "../config/logger";
import type { BotEvent } from "../shared/types/bot-event";

export class DiscordBotClient {
  readonly client: Client;

  constructor() {
    this.client = new Client({
      intents: [GatewayIntentBits.Guilds],
    });
  }

  registerEvents(events: BotEvent[]) {
    for (const event of events) {
      if (event.once) {
        this.client.once(event.name, (...args) => {
          void event.execute(...args);
        });
        continue;
      }

      this.client.on(event.name, (...args) => {
        void event.execute(...args);
      });
    }
  }

  async login(token: string) {
    logger.info("Starting Discord bot client");
    await this.client.login(token);
  }
}
