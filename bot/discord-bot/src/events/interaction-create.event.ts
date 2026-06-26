import type { Interaction } from "discord.js";

import { logger } from "../config/logger";
import type { CommandRegistry } from "../shared/registry/command.registry";
import type { BotEvent } from "../shared/types/bot-event";

export const createInteractionCreateEvent = (
  commandRegistry: CommandRegistry,
): BotEvent<"interactionCreate"> => ({
  name: "interactionCreate",
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) {
      return;
    }

    const command = commandRegistry.get(interaction.commandName);

    if (!command) {
      logger.warn("Command not found", { commandName: interaction.commandName });
      await interaction.reply({
        content: "Command does not exist.",
        ephemeral: true,
      });
      return;
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error("Failed to execute command", {
        commandName: interaction.commandName,
        error,
      });

      const reply = {
        content: "An unexpected error occurred while executing this command.",
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
        return;
      }

      await interaction.reply(reply);
    }
  },
});
