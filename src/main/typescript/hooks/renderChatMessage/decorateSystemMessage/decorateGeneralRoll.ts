import { getContentElement } from ".";
import { CONSTANTS } from "../../../constants";
import type { HookParams } from "..";
import { scrollChatToBottom } from "../../../foundryHelpers";
import type { Critical } from "../../../rolls/criticalsModifiers";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/generalRoll.hbs`;
export default async function decoratePTMessage(
  flags: GeneralRollFlags,
  html: HookParams[1]
) {
  const content = getContentElement(html);
  const data = {
    ...flags,
    template: {
      keys: {
        success: getCheckResultKey(flags)
      }
    }
  };
  content.append(await renderTemplate(TEMPLATE, data));
  scrollChatToBottom();
  return;
}

export interface GeneralRollFlags {
  type: "roll";
  roll: {
    formula: string;
    critical?: Critical | undefined;
    result: number;
    total: number;
  };
}

function getCheckResultKey(flags: GeneralRollFlags): string {
  let key = "wv.rules.rolls.results.";
  const roll = flags.roll;
  if (roll.critical === "success") key += "criticalSuccess";
  else if (roll.critical === "failure") key += "criticalFailure";
  else if (roll.total === 1) key += "success";
  else key += "failure";
  return key;
}
