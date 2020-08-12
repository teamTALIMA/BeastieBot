import { CommandModule } from "./index";
import CommandContext from "./utils/commandContext";

const execute = async (context: CommandContext): Promise<string> => {
  return context.platform === "twitch"
    ? "ʕ•ᴥ•ʔ teamta1RAWR teamta1RAWR"
    : "ʕ•ᴥ•ʔ <:teamta1RAWR:704871701992702013> <:teamta1RAWR:704871701992702013>";
};

const cmdModule = new CommandModule("rawr", new Set([]), execute);
export default cmdModule;
