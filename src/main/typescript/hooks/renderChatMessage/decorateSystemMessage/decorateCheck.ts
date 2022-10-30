import { CommonRollFlags, getContentElement } from ".";
import { CONSTANTS } from "../../../constants";
import type { HookParams } from "..";
import { scrollChatToBottom } from "../../../foundryHelpers";
import type { Critical } from "../../../rolls/criticalsModifiers";
import { Component, CompositeNumber } from "../../../data/common";
import { isRollBlindedForCurrUser } from "../../../foundryHelpers";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/check.hbs`;
export default async function decorateCheck(
  flags: CheckFlags,
  html: HookParams[1]
) {
  html.addClass("detailed-roll");
  const content = getContentElement(html);
  const data: CheckTemplateData = {
    ...flags,
    details: {
      criticals: {
        failure: CompositeNumber.from(flags.details.criticals.failure),
        success: CompositeNumber.from(flags.details.criticals.success)
      },
      successChance: CompositeNumber.from(flags.details.successChance)
    },
    template: {
      keys: getCheckResultKeys(flags.roll),
      blinded: isRollBlindedForCurrUser(flags.blind)
    }
  };
  content.append(await renderTemplate(TEMPLATE, data));
  scrollChatToBottom();
  return;
}

export type CheckFlags = CommonRollFlags & {
  type: "roll";
  roll: {
    formula: string;
    critical?: Critical | undefined;
    result: number;
    degreesOfSuccess: number;
    total: number;
  };
};

function getCheckResultKeys(roll: CheckFlags["roll"]): CheckTemplateDataKeys {
  let success = "wv.rules.rolls.results.";
  let degrees = "wv.rules.rolls.results.";

  if (roll.critical === "success") success += "criticalSuccess";
  else if (roll.critical === "failure") success += "criticalFailure";
  else if (roll.total === 1) success += "success";
  else success += "failure";

  if (roll.critical === "success" || roll.total === 1)
    degrees += "successDegrees";
  else degrees += "failureDegrees";

  return { success, degrees };
}

type CheckTemplateDataKeys = { success: string; degrees: string };

type CheckTemplateData = CheckFlags & {
  details: {
    criticals: {
      failure: CompositeNumber;
      success: CompositeNumber;
    };
    successChance: {
      components: Component[];
      total: number;
    };
  };
  template: {
    keys: {
      success: string;
      degrees: string;
    };
    blinded: boolean;
  };
};
