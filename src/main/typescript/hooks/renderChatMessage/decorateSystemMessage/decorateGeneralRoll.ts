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
  html.addClass("general-roll");
  const content = getContentElement(html);
  const data: GeneralRollTemplateData = {
    ...flags,
    template: {
      keys: getCheckResultKey(flags)
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
    degree: number;
    total: number;
  };
}

function getCheckResultKey(flags: GeneralRollFlags): {
  success: string;
  degrees: string;
} {
  let success = "wv.rules.rolls.results.";
  let degrees = "wv.rules.rolls.results.";
  const roll = flags.roll;
  if (roll.critical === "success") success += "criticalSuccess";
  else if (roll.critical === "failure") success += "criticalFailure";
  else if (roll.total === 1) success += "success";
  else success += "failure";
  if (success.includes("uccess")) degrees += "successDegrees";
  else degrees += "failureDegrees";

  return { success, degrees };
}

type GeneralRollTemplateDataKeys = { success: string; degrees: string };

type GeneralRollTemplateData = GeneralRollFlags & {
  template: {
    keys: {
      success: string;
      degrees: string;
    };
  };
};
