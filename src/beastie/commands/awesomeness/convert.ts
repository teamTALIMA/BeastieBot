import { updateAwesomeness, getAwesomeness } from "../../../services/db";
import { BeastieLogger } from "../../../utils/Logging";
import CommandContext from "../utils/commandContext";
import { CommandModule } from "../index";

const execute = async (context: CommandContext): Promise<string> => {
  if (context.platform !== "twitch")
    return "This command only works in Twitch chat. teamta1RAWR";

  const amount = Math.min(500, Math.max(0, parseInt(context.para1, 10))) * -1;
  if (isNaN(amount)) return "Cannot convert, please pass in a valid number";

  try {
    if ((await getAwesomeness(context.twitchId).catch(() => 0)) < amount)
      return `${context.displayName}, You have insufficient awesomeness. No points converted.`;

    const successfulUpdate = await updateAwesomeness(
      context.twitchId,
      context.username,
      amount
    );

    if (successfulUpdate)
      return `!addpoints ${context.username} ${amount * -1}`;
  } catch (error) {
    BeastieLogger.warn(`"updateAwesomeness ERROR ${error}`);
  }
  return "Sorry, conversion failed";
};

const cmdModule = new CommandModule("convert", new Set([]), execute);
export default cmdModule;
