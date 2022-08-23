import { getContentElement } from ".";
import type { HookParams } from "..";
import { CONSTANTS, PainThreshold } from "../../../constants";
import { scrollChatToBottom } from "../../../foundryHelpers";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/painThreshold.hbs`;
export default async function decoratePTMessage(
  flags: PainThresholdFlags,
  html: HookParams[1]
) {
  const content = getContentElement(html);
  const data = { painThreshold: flags.newPainThreshold };
  content.append(await renderTemplate(TEMPLATE, data));
  scrollChatToBottom();
  return;
}

export interface PainThresholdFlags {
  type: "painThreshold";
  oldPainThreshold: PainThreshold;
  newPainThreshold: PainThreshold;
}
