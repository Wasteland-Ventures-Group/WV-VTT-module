import type { HookParams } from "./index.js";

/** Decorate roll messages with critical results */
export default function decorateCriticalRollMessage(
  message: HookParams[0],
  html: HookParams[1]
): void {
  if (!message.isRoll) return;

  const roll = message.roll;
  if (!roll) return;

  const searchResult = findCriticals(roll);
  if (searchResult === "none") return;

  switch (searchResult) {
    case "failure":
      decorateHasCritFailure(html);
      break;
    case "success":
      decorateHasCritSuccess(html);
      break;
    case "both":
      decorateHasBothCriticals(html);
  }
}

/** Decorate for a critical failure. */
function decorateHasCritFailure(html: HookParams[1]) {
  const resultElement = getResultElement(html);
  resultElement.classList.add("critical-failure");
}

/** Decorate for a critical success. */
function decorateHasCritSuccess(html: HookParams[1]) {
  const resultElement = getResultElement(html);
  resultElement.classList.add("critical-success");
}

/** Decorate for both types of criticals. */
function decorateHasBothCriticals(html: HookParams[1]) {
  const resultElement = getResultElement(html);
  resultElement.classList.add("criticals");
}

/** Get the dice total element. */
function getResultElement(html: HookParams[1]): HTMLElement {
  return html.find(".dice-total")[0];
}

/** Check and find the at least one critical result. */
function findCriticals(roll: Roll): SearchResult {
  let hasFailure = false;
  let hasSuccess = false;

  for (const term of roll.terms) {
    if (!(term instanceof Die)) continue;

    for (const result of term.results) {
      if (result.criticalFailure) {
        if (hasSuccess) return "both";
        hasFailure = true;
      } else if (result.criticalSuccess) {
        if (hasFailure) return "both";
        hasSuccess = true;
      }
    }
  }

  if (hasFailure) return "failure";
  if (hasSuccess) return "success";
  return "none";
}

type SearchResult = "none" | "failure" | "success" | "both";
