import type { ChatInputCommandInteraction } from "discord.js";

import { PingService } from "./ping.service";

export class PingController {
  constructor(private readonly pingService: PingService) {}

  async handle(interaction: ChatInputCommandInteraction) {
    const reply = this.pingService.buildReply(interaction.client.ws.ping);
    await interaction.reply(reply);
  }
}
