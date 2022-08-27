import { getContentElement } from ".";
import { CONSTANTS } from "../../../constants";
import type { HookParams } from "..";
import { scrollChatToBottom } from "../../../foundryHelpers";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/generalRoll.hbs`;
export default async function decoratePTMessage(
  flags: GeneralRollFlags,
  html: HookParams[1]
) {
  const content = getContentElement(html);
  const data = {};
  content.append(await renderTemplate(TEMPLATE, data));
  scrollChatToBottom();
  return;
}

export interface GeneralRollFlags {
  type: "roll";
}
