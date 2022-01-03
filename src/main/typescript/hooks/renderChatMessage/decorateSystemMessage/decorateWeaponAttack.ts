import { CONSTANTS } from "../../../constants.js";
import type { Specials } from "../../../data/actor/properties.js";
import type WeaponDataProperties from "../../../data/item/weapon/properties.js";
import { getDisplayRanges, RangeBracket } from "../../../item/weapon/ranges.js";
import type { Critical } from "../../../rolls/criticalsModifiers.js";
import type { HookParams } from "../index.js";
import { getContentElement } from "./index.js";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/weaponAttack.hbs`;

/** Decorate a weapon attack message. */
export default async function decorateWeaponAttack(
  flags: WeaponAttackFlags,
  html: HookParams[1]
): Promise<void> {
  html.addClass("weapon-attack");

  const content = getContentElement(html);

  if (!flags.executed) {
    const data: NotExecutedAttackTemplateData = {
      ...flags,
      template: {
        keys: {
          notExecutedReason: getNotExecutedReasonKey(flags)
        }
      }
    };
    content.append(await renderTemplate(TEMPLATE, data));
    return;
  }

  const data: ExecutedAttackTemplateData = {
    ...flags,
    template: {
      damage: {
        results: flags.rolls.damage.results.map((result) => {
          return {
            class: result >= CONSTANTS.rules.damage.dieTarget ? "success" : "",
            value: result
          };
        })
      },
      keys: {
        hit: getHitResultKey(flags),
        rangeBracket: getRangeBracketKey(flags)
      },
      raw: {
        displayRanges: getDisplayRanges(
          flags.weaponSystemData,
          flags.ownerSpecials
        ),
        mainHeading:
          flags.weaponName !== flags.weaponSystemData.name
            ? flags.weaponName
            : flags.weaponSystemData.name,
        subHeading:
          flags.weaponName !== flags.weaponSystemData.name
            ? `${flags.weaponSystemData.name} - ${flags.attackName}`
            : flags.attackName
      }
    }
  };
  content.append(await renderTemplate(TEMPLATE, data));
}

/** Get the i18n key for the not executed reason. */
function getNotExecutedReasonKey(flags: NotExecutedAttackFlags): string {
  switch (flags.reason) {
    case "insufficientAp":
      return "wv.weapons.attacks.notEnoughAp";
    case "outOfRange":
      return "wv.weapons.attacks.outOfRange";
    default:
      return "wv.weapons.attacks.unknownReason";
  }
}

/** Get the hit result i18n key. */
function getHitResultKey(flags: ExecutedAttackFlags): string {
  let key = "wv.weapons.attacks.results.";
  if (flags.rolls.hit.critical === "success") key += "criticalHit";
  else if (flags.rolls.hit.critical === "failure") key += "criticalMiss";
  else if (flags.rolls.hit.total === 1) key += "hit";
  else key += "miss";
  return key;
}

/** Get the i18n key for the range bracket. */
function getRangeBracketKey(flags: ExecutedAttackFlags): string | undefined {
  switch (flags.details?.range.bracket) {
    case RangeBracket.LONG:
      return "wv.weapons.ranges.brackets.long";
    case RangeBracket.MEDIUM:
      return "wv.weapons.ranges.brackets.medium";
    case RangeBracket.SHORT:
      return "wv.weapons.ranges.brackets.short";
    case RangeBracket.POINT_BLANK:
      return "wv.weapons.ranges.brackets.pointBlank";
  }
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
  details?: {
    criticals: {
      failure: number;
      success: number;
    };
    damage: {
      base: DetailsListingInfo;
      dice: DetailsListingInfo;
    };
    hit: DetailsListingInfo;
    range: {
      bracket: RangeBracket;
      distance: number;
    };
  };
  rolls: {
    damage: {
      formula: string;
      results: number[];
      total: number;
    };
    hit: {
      critical?: Critical | undefined;
      formula: string;
      result: number;
      total: number;
    };
  };
}

export interface ModifierFlags {
  amount: number;
  key: string;
}

interface DetailsListingInfo {
  base: number;
  modifiers: ModifierFlags[];
  total: number;
}

/** The data for rendering the not executed weapon attack template */
interface NotExecutedAttackTemplateData extends NotExecutedAttackFlags {
  template: {
    keys: {
      notExecutedReason: string;
    };
  };
}

/** The data for rendering the executed weapon attack template */
interface ExecutedAttackTemplateData extends ExecutedAttackFlags {
  template: {
    damage: {
      results: {
        class: string;
        value: number;
      }[];
    };
    keys: {
      hit: string;
      rangeBracket: string | undefined;
    };
    raw: {
      displayRanges: string;
      mainHeading: string;
      subHeading: string;
    };
  };
}
