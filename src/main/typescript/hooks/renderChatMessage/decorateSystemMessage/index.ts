import { CONSTANTS } from "../../../constants.js";
import type { HookParams } from "../index.js";
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
      decorateWeaponAttack(systemFlags as WeaponAttackFlags, html);
      break;
    case "painThreshold":
      decoratePTMessage(systemFlags as PainThresholdFlags, html);
      break;
  }
}

/** Get the JQuery for the content Element of the default message. */
export function getContentElement(html: HookParams[1]): JQuery<HTMLElement> {
  return html.find("div.message-content");
}

/** A type for system chat message flags */
export type SystemChatMessageFlags = WeaponAttackFlags | PainThresholdFlags;
