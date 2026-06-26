import { SlashCommandBuilder } from "discord.js";

import type { BotCommand } from "../../shared/types/bot-command";
import { PingController } from "./ping.controller";
import { PingService } from "./ping.service";

const pingController = new PingController(new PingService());

export const pingCommand: BotCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check bot latency")
    .toJSON(),
  execute: async (interaction) => {
    await pingController.handle(interaction);
  },
};
