import { CONSTANTS } from "../constants.js";
import type { Specials } from "../data/actor/actorData.js";
import type WeaponDataProperties from "../data/item/weapon/properties.js";
import { getDisplayRanges } from "../data/item/weapon/ranges.js";
import { getGame } from "../foundryHelpers.js";

/** Register system callbacks for the renderChatMessage hook. */
export default function registerForRenderChatMessage(): void {
  Hooks.on("renderChatMessage", decorateSystemMessage);
}

type HookParams = Parameters<Hooks.StaticCallbacks["renderChatMessage"]>;

/** Decorate system messages with content from their flags. */
function decorateSystemMessage(message: HookParams[0], html: HookParams[1]) {
  html.addClass(`${CONSTANTS.systemId} system-message`);

  const systemFlags = message.data.flags[CONSTANTS.systemId];
  switch (systemFlags?.type) {
    case "weaponAttack":
      decorateWeaponAttack(systemFlags, html);
      break;
  }
}

export type SystemChatMessageFlags = WeaponAttackFlags;

export type WeaponAttackFlags = BaseWeaponAttackFlags &
  (NotExecutedAttackFlags | ExecutedAttackFlags);

export interface BaseWeaponAttackFlags {
  type: "weaponAttack";
  weaponName: string;
  weaponSystemData: WeaponDataProperties["data"];
  attackName: string;
}

export interface NotExecutedAttackFlags {
  executed: false;
  reason?: "insufficientAp" | "outOfRange";
}

export interface ExecutedAttackFlags {
  executed: true;
  ownerSpecials?: Specials | undefined;
  rolls: {
    damage: {
      formula: string;
      results: number[];
      total: number;
    };
    hit: {
      formula: string;
      result: number;
      total: number;
    };
  };
}

/** Decorate a weapon attack message. */
function decorateWeaponAttack(flags: WeaponAttackFlags, html: HookParams[1]) {
  const content = getContentElement(html);

  content.append(
    getWeaponAttackHeader(
      flags.weaponName,
      flags.weaponSystemData,
      flags.attackName
    )
  );

  if (!flags.executed) {
    const messageSpan = document.createElement("span");
    content.append(messageSpan);
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
    return;
  }

  if (flags.weaponSystemData.notes) {
    const notesParagraph = document.createElement("p");
    content.append(notesParagraph);
    notesParagraph.textContent = flags.weaponSystemData.notes;
  }

  const hitParagraph = document.createElement("p");
  content.append(hitParagraph);
  hitParagraph.textContent =
    getGame().i18n.localize("wv.weapons.attacks.hitRoll") +
    ': "' +
    flags.rolls.hit.formula +
    '" (' +
    flags.rolls.hit.result +
    ") => " +
    flags.rolls.hit.total;

  const damageParagraph = document.createElement("p");
  content.append(damageParagraph);
  damageParagraph.textContent =
    getGame().i18n.localize("wv.weapons.attacks.damageRoll") +
    ': "' +
    flags.rolls.damage.formula +
    '" (' +
    flags.rolls.damage.results +
    ") => " +
    flags.rolls.damage.total;

  const detailsList = document.createElement("ul");
  content.append(detailsList);

  const rangesItem = document.createElement("li");
  detailsList.append(rangesItem);
  rangesItem.textContent =
    getGame().i18n.localize("wv.weapons.attacks.range") +
    ": " +
    getDisplayRanges(flags.weaponSystemData, flags.ownerSpecials);
}

/** Get the headers for a weapon attack message. */
function getWeaponAttackHeader(
  name: string,
  weaponData: WeaponDataProperties["data"],
  attackName: string
): HTMLHeadingElement[] {
  const hasCustomName = name !== weaponData.name;

  const heading = document.createElement("h3");
  heading.textContent = hasCustomName ? name : weaponData.name;

  const subHeading = document.createElement("h4");
  subHeading.textContent = hasCustomName
    ? `${weaponData.name} - ${attackName}`
    : attackName;

  return [heading, subHeading];
}

/** Get the JQuery for the content Element of the default message. */
function getContentElement(html: HookParams[1]): JQuery<HTMLElement> {
  return html.find("div.message-content");
}
