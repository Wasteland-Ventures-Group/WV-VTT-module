import { CONSTANTS } from "../../../constants.js";
import type { SerializedCompositeNumber } from "../../../data/common.js";
import type { HookParams } from "../index.js";
import decorateCheck, { CheckFlags } from "./decorateCheck.js";
import decoratePTMessage, { PainThresholdFlags } from "./decoratePTMessage.js";
import decorateWeaponAttack, {
  WeaponAttackFlags
} from "./decorateWeaponAttack.js";

/** Decorate system messages with content from their flags. */
export default function decorateSystemMessage(
  message: HookParams[0],
  html: HookParams[1]
): void {
  const systemFlags = message.data.flags[CONSTANTS.systemId];
  if (!systemFlags) {
    return;
  }

  html.addClass([CONSTANTS.systemId, "system-message"]);
  switch (systemFlags?.type) {
    case "weaponAttack":
      decorateWeaponAttack(systemFlags, html);
      break;
    case "painThreshold":
      decoratePTMessage(systemFlags, html);
      break;
    case "roll":
      decorateCheck(systemFlags, html);
  }
}

/** Get the JQuery for the content Element of the default message. */
export function getContentElement(html: HookParams[1]): JQuery<HTMLElement> {
  return html.find("div.message-content");
}

export type CommonRollFlags = {
  details: {
    criticals: {
      success: SerializedCompositeNumber;
      failure: SerializedCompositeNumber;
    };
    successChance: SerializedCompositeNumber;
  };
  blind: boolean;
};

/** A type for system chat message flags */
export type SystemChatMessageFlags =
  | WeaponAttackFlags
  | PainThresholdFlags
  | CheckFlags;
