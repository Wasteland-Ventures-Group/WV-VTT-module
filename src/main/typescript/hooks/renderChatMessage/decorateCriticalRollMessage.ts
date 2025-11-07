import type { Critical } from "../../rolls/criticalsModifiers.js";
import type { HookParams } from "./index.js";

/** Decorate roll messages with critical results */
export default function decorateCriticalRollMessage(
  message: HookParams[0],
  html: HookParams[1],
  _data: HookParams[2],
): void {
  if (!message.isRoll) return;

  const roll = message.rolls[0];
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
  resultElement?.classList.add("critical-failure");
}

/** Decorate for a critical success. */
function decorateHasCritSuccess(html: HookParams[1]) {
  const resultElement = getResultElement(html);
  resultElement?.classList.add("critical-success");
}

/** Decorate for both types of criticals. */
function decorateHasBothCriticals(html: HookParams[1]) {
  const resultElement = getResultElement(html);
  resultElement?.classList.add("criticals");
}

/** Get the dice total element. */
function getResultElement(html: HookParams[1]): HTMLElement | undefined {
  for (const elem of html.getElementsByClassName("dice-total")) {
    if (elem instanceof HTMLElement) {
      return elem;
    }
  }
  return undefined;
}

/** Check and find the at least one critical result. */
function findCriticals(roll: Roll): SearchResult {
  let hasFailure = false;
  let hasSuccess = false;

  for (const term of roll.terms) {
    if (!(term instanceof Die)) continue;

    for (const result of term.results) {
      if (!result.critical) continue;

      switch (result.critical) {
        case "failure":
          if (hasSuccess) return "both";
          hasFailure = true;
          break;
        case "success":
          if (hasFailure) return "both";
          hasSuccess = true;
          break;
      }
    }
  }

  if (hasFailure) return "failure";
  if (hasSuccess) return "success";
  return "none";
}

type SearchResult = Critical | "both";
