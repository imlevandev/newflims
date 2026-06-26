import type { BotCommand } from "../shared/types/bot-command";
import { pingCommand } from "../modules/ping/ping.command";

export const loadCommands = (): BotCommand[] => {
  return [pingCommand];
};
