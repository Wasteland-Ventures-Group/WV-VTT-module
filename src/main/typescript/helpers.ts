import type { ChatMessageDataConstructorData } from "@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/chatMessageData";
import type { RollMode } from "./constants";
import { getGame } from "./foundryHelpers.js";

/**
 * Run `toFixed(fractionDigits)` on the number and remove trailing zeros and
 * potential floating point.
 *
 * @param number - the number to run the operation on
 * @param fractionDigits - the number fractional digits to round to
 * @returns the formatted number or an empty string, if not present
 */
export function toFixed(
  number: number | undefined | null,
  fractionDigits = 2
): string {
  if (typeof number !== "number") return "";

  return number.toFixed(fractionDigits).replace(/[.,]?0+$/, "");
}

/** Create the default message data for weapon attack messages. */
export function createDefaultMessageData(
  speaker: foundry.data.ChatMessageData["speaker"]["_source"],
  rollMode: RollMode
): ChatMessageDataConstructorData {
  return {
    speaker,
    whisper: whisperTargets(rollMode)
  };
}

export function whisperTargets(
  rollMode: RollMode
): StoredDocument<User>[] | null {
  const self = getGame().user;
  switch (rollMode) {
    case "publicroll":
      return null;
    case "blindroll":
    case "gmroll":
      return ChatMessage.getWhisperRecipients("gm");
    case "selfroll":
      return self ? [self] : [];
  }
}
