import { createInteractionCreateEvent } from "../events/interaction-create.event";
import { readyEvent } from "../events/ready.event";
import type { CommandRegistry } from "../shared/registry/command.registry";
import type { BotEvent } from "../shared/types/bot-event";

export const loadEvents = (commandRegistry: CommandRegistry): BotEvent[] => {
  return [readyEvent, createInteractionCreateEvent(commandRegistry)];
};
