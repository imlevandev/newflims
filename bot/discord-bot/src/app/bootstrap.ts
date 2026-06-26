import { DiscordBotClient } from "./client";
import { env } from "../config/env";
import { loadCommands } from "../loaders/command.loader";
import { loadEvents } from "../loaders/event.loader";
import { CommandRegistry } from "../shared/registry/command.registry";

export const bootstrap = async () => {
  const botClient = new DiscordBotClient();
  const commandRegistry = new CommandRegistry();

  for (const command of loadCommands()) {
    commandRegistry.register(command);
  }

  const events = loadEvents(commandRegistry);
  botClient.registerEvents(events);

  await botClient.login(env.DISCORD_BOT_TOKEN);
};
