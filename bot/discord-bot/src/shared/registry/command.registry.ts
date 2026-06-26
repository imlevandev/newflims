import type { BotCommand } from "../types/bot-command";

export class CommandRegistry {
  private readonly commands = new Map<string, BotCommand>();

  register(command: BotCommand) {
    this.commands.set(command.data.name, command);
  }

  get(name: string) {
    return this.commands.get(name);
  }

  getAll() {
    return [...this.commands.values()];
  }
}
