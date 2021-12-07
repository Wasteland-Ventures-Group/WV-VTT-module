import { CONSTANTS } from "../../../constants.js";
import type { Specials } from "../../../data/actor/properties.js";
import type WeaponDataProperties from "../../../data/item/weapon/properties.js";
import { getDisplayRanges } from "../../../data/item/weapon/ranges.js";
import { getGame } from "../../../foundryHelpers.js";
import type { Critical } from "../../../rolls/criticalsModifiers.js";
import type { HookParams } from "../index.js";
import { getContentElement } from "./index.js";

/** An Error message for when unexpectedly handling an executed attack. */
const EXECUTED_MESSAGE = "The attack for this message was executed!";

/** An Error message for when unexpectedly handling a not executed attack. */
const NOT_EXECUTED_MESSAGE = "The attack for this message was not executed!";

/** Decorate a weapon attack message. */
export default function decorateWeaponAttack(
  flags: WeaponAttackFlags,
  html: HookParams[1]
): void {
  html.addClass("weapon-attack");

  const content = getContentElement(html);

  content.append(getWeaponAttackHeader(flags));

  if (!flags.executed) {
    content.append(getNotExecutedMessage(flags));
    return;
  }

  if (flags.weaponSystemData.notes) {
    const notesParagraph = document.createElement("p");
    notesParagraph.textContent = flags.weaponSystemData.notes;
    content.append(notesParagraph);
  }

  content.append(
    getDetailsElement(flags),
    getHitRollElement(flags),
    getDamageRollElement(flags)
  );
}

/** Get the headers for a weapon attack message. */
function getWeaponAttackHeader(flags: WeaponAttackFlags): HTMLElement[] {
  const name = flags.weaponName;
  const weaponData = flags.weaponSystemData;
  const attackName = flags.attackName;
  const hasCustomName = name !== weaponData.name;

  const elements: HTMLElement[] = [];

  if (flags.weaponImage) {
    const image = document.createElement("img");
    image.src = flags.weaponImage;
    elements.push(image);
  }

  const heading = document.createElement("h3");
  heading.textContent = hasCustomName ? name : weaponData.name;
  elements.push(heading);

  const subHeading = document.createElement("h4");
  subHeading.textContent = hasCustomName
    ? `${weaponData.name} - ${attackName}`
    : attackName;
  elements.push(subHeading);

  return elements;
}

/** Get the appropriate message for not executed attacks. */
function getNotExecutedMessage(flags: WeaponAttackFlags): HTMLElement {
  if (flags.executed) throw new Error(EXECUTED_MESSAGE);

  const messageSpan = document.createElement("span");
  let i18nKey = "wv.weapons.attacks.unknownReason";
  switch (flags.reason) {
    case "insufficientAp":
      i18nKey = "wv.weapons.attacks.notEnoughAp";
      break;
    case "outOfRange":
      i18nKey = "wv.weapons.attacks.outOfRange";
      break;
  }
  messageSpan.textContent = getGame().i18n.localize(i18nKey);
  return messageSpan;
}

/** Get the message element containing the hit roll info. */
function getHitRollElement(flags: WeaponAttackFlags): HTMLElement {
  if (!flags.executed) throw new Error(NOT_EXECUTED_MESSAGE);

  const detailContentDiv = document.createElement("div");

  const dieItem = document.createElement("li");
  dieItem.classList.add("roll", "d100");
  dieItem.textContent = flags.rolls.hit.result.toString();
  if (flags.rolls.hit.total === 1) dieItem.classList.add("success");

  detailContentDiv.append(
    createDiceRollDetail(flags.rolls.hit.formula, [dieItem])
  );

  return createDetailSection(
    createRollSummary(getHitResultText(flags), flags.rolls.hit.result),
    detailContentDiv
  );
}

/** Get the hit result text for the hit roll element. */
function getHitResultText(flags: WeaponAttackFlags): string {
  if (!flags.executed) throw new Error(NOT_EXECUTED_MESSAGE);

  let key = "wv.weapons.attacks.results.";
  if (flags.rolls.hit.critical === "success") key += "criticalHit";
  else if (flags.rolls.hit.critical === "failure") key += "criticalMiss";
  else if (flags.rolls.hit.total === 1) key += "hit";
  else key += "miss";

  return getGame().i18n.localize(key);
}

/** Get the message element containing the damage roll info. */
function getDamageRollElement(flags: WeaponAttackFlags): HTMLElement {
  if (!flags.executed) throw new Error(NOT_EXECUTED_MESSAGE);

  const detailContentDiv = document.createElement("div");

  detailContentDiv.append(
    createDiceRollDetail(
      flags.rolls.damage.formula,
      flags.rolls.damage.results.map((result) => {
        const dieItem = document.createElement("li");
        dieItem.classList.add("roll", "d6");
        dieItem.textContent = result.toString();
        if (result >= CONSTANTS.rules.damage.dieTarget)
          dieItem.classList.add("success");
        return dieItem;
      })
    )
  );

  return createDetailSection(
    createRollSummary(
      getGame().i18n.localize("wv.weapons.attacks.damageRoll"),
      flags.rolls.damage.total
    ),
    detailContentDiv
  );
}

/** Get the details list for a weapon attack. */
function getDetailsElement(flags: WeaponAttackFlags): HTMLElement {
  if (!flags.executed) throw new Error(NOT_EXECUTED_MESSAGE);

  const detailsTitleSpan = document.createElement("span");
  detailsTitleSpan.textContent = getGame().i18n.localize(
    "wv.weapons.attacks.details"
  );

  const detailsList = document.createElement("ul");

  const rangesItem = document.createElement("li");
  rangesItem.textContent =
    getGame().i18n.localize("wv.weapons.attacks.range") +
    ": " +
    getDisplayRanges(flags.weaponSystemData, flags.ownerSpecials);

  detailsList.append(rangesItem);

  return createDetailSection(detailsTitleSpan, detailsList);
}

/** Create a roll summary element. */
function createRollSummary(label: string, result: number): HTMLElement {
  const rollSummaryDiv = document.createElement("div");
  rollSummaryDiv.classList.add("roll-summary");

  const rollSummaryLabel = document.createElement("label");
  rollSummaryLabel.classList.add("roll-summary-label");
  rollSummaryLabel.textContent = label;

  const rollSummaryResultDiv = document.createElement("div");
  rollSummaryResultDiv.classList.add("roll-summary-result");
  rollSummaryResultDiv.textContent = result.toString();

  rollSummaryDiv.append(rollSummaryLabel, rollSummaryResultDiv);

  return rollSummaryDiv;
}

/** Create a detail section with the given title and content. */
function createDetailSection(
  title: HTMLElement,
  content: HTMLElement
): HTMLElement {
  const detailSection = document.createElement("div");
  detailSection.classList.add("detail-section");
  detailSection.addEventListener("click", onDetailSectionClick);

  detailSection.append(title, content);

  content.classList.add("detail-content");

  return detailSection;
}

/** An event handler for clicks on detail sections. */
function onDetailSectionClick(event: Event): void {
  event.preventDefault();
  if (!event.currentTarget) return;
  const detailSection = $(event.currentTarget);
  const detailContent = detailSection.find(".detail-content");
  if (detailContent.is(":visible")) detailContent.slideUp(200);
  else detailContent.slideDown(200);
}

/** Create a dice roll detail div with a formula and a list of rolled dice. */
function createDiceRollDetail(
  formula: string,
  dieItems: HTMLLIElement[]
): HTMLElement {
  const diceRollDiv = document.createElement("div");
  diceRollDiv.classList.add("roll-details");

  const formulaDiv = document.createElement("div");
  formulaDiv.classList.add("dice-formula");
  formulaDiv.textContent = formula;

  const dieList = document.createElement("ul");
  dieList.classList.add("dice-rolls");
  dieList.append(...dieItems);

  diceRollDiv.append(formulaDiv, dieList);

  return diceRollDiv;
}

/** A type representing the possible weapon attack chat message flags */
export type WeaponAttackFlags = NotExecutedAttackFlags | ExecutedAttackFlags;

/** The common weapon attack chat message flags */
interface CommonWeaponAttackFlags {
  type: "weaponAttack";
  weaponName: string;
  weaponImage: string | null;
  weaponSystemData: WeaponDataProperties["data"];
  attackName: string;
}

/** The attack chat message flags for a unexecuted attack */
export interface NotExecutedAttackFlags extends CommonWeaponAttackFlags {
  executed: false;
  reason?: "insufficientAp" | "outOfRange";
}

/** The attack chat message flags for an executed attack */
export interface ExecutedAttackFlags extends CommonWeaponAttackFlags {
  executed: true;
  ownerSpecials?: Partial<Specials> | undefined;
  rolls: {
    damage: {
      formula: string;
      results: number[];
      total: number;
    };
    hit: {
      critical?: Critical;
      formula: string;
      result: number;
      total: number;
    };
  };
}
