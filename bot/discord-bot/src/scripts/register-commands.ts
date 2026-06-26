import { REST, Routes } from "discord.js";

import { env } from "../config/env";
import { logger } from "../config/logger";
import { loadCommands } from "../loaders/command.loader";

const rest = new REST({ version: "10" }).setToken(env.DISCORD_BOT_TOKEN);
const commands = loadCommands().map((command) => command.data);

const registerCommands = async () => {
  const route = env.DISCORD_GUILD_ID
    ? Routes.applicationGuildCommands(
        env.DISCORD_CLIENT_ID,
        env.DISCORD_GUILD_ID,
      )
    : Routes.applicationCommands(env.DISCORD_CLIENT_ID);

  await rest.put(route, { body: commands });

  logger.info("Registered slash commands", {
    scope: env.DISCORD_GUILD_ID ? "guild" : "global",
    total: commands.length,
  });
};

void registerCommands();
