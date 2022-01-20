import { CONSTANTS } from "../../../constants.js";
import type Specials from "../../../data/actor/character/specials/properties.js";
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

  const commonData: CommonWeaponAttackTemplateData = {
    ...flags,
    template: {
      keys: {
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

  if (!flags.executed) {
    const data: NotExecutedAttackTemplateData = {
      ...flags,
      ...commonData,
      template: {
        ...commonData.template,
        keys: {
          ...commonData.template.keys,
          notExecutedReason: getNotExecutedReasonKey(flags)
        }
      }
    };
    content.append(await renderTemplate(TEMPLATE, data));
    return;
  }

  const data: ExecutedAttackTemplateData = {
    ...flags,
    ...commonData,
    template: {
      ...commonData.template,
      damage: {
        results: flags.rolls.damage.results.map((result) => {
          return {
            class: result >= CONSTANTS.rules.damage.dieTarget ? "success" : "",
            value: result
          };
        })
      },
      keys: {
        ...commonData.template.keys,
        hit: getHitResultKey(flags)
      }
    }
  };
  content.append(await renderTemplate(TEMPLATE, data));
}

/** Get the i18n key for the not executed reason. */
function getNotExecutedReasonKey(flags: NotExecutedAttackFlags): string {
  switch (flags.reason) {
    case "insufficientAp":
      return "wv.system.messages.notEnoughAp";
    case "outOfRange":
      return "wv.system.messages.targetOutOfRange";
    default:
      return "wv.weapons.attacks.unknownReason";
  }
}

/** Get the hit result i18n key. */
function getHitResultKey(flags: ExecutedAttackFlags): string {
  let key = "wv.rules.rolls.results.";
  if (flags.rolls.hit.critical === "success") key += "criticalHit";
  else if (flags.rolls.hit.critical === "failure") key += "criticalMiss";
  else if (flags.rolls.hit.total === 1) key += "hit";
  else key += "miss";
  return key;
}

/** Get the i18n key for the range bracket. */
function getRangeBracketKey(
  flags: CommonWeaponAttackFlags
): string | undefined {
  switch (flags.details?.range.bracket) {
    case RangeBracket.OUT_OF_RANGE:
      return "wv.rules.range.ranges.outOfRange";
    case RangeBracket.LONG:
      return "wv.rules.range.ranges.long";
    case RangeBracket.MEDIUM:
      return "wv.rules.range.ranges.medium";
    case RangeBracket.SHORT:
      return "wv.rules.range.ranges.short";
  }
}

/** A type representing the possible weapon attack chat message flags */
export type WeaponAttackFlags = NotExecutedAttackFlags | ExecutedAttackFlags;

/** The common weapon attack chat message flags */
export interface CommonWeaponAttackFlags {
  type: "weaponAttack";
  attackName: string;
  details: {
    ap: {
      previous: number;
      cost: number;
      remaining: number;
    };
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
  ownerSpecials?: Partial<Specials> | undefined;
  weaponImage: string | null;
  weaponName: string;
  weaponSystemData: WeaponDataProperties["data"];
}

/** The attack chat message flags for a unexecuted attack */
export type NotExecutedAttackFlags = CommonWeaponAttackFlags & {
  executed: false;
  reason?: "insufficientAp" | "outOfRange";
};

/** The attack chat message flags for an executed attack */
export type ExecutedAttackFlags = CommonWeaponAttackFlags & {
  executed: true;
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
};

export interface ModifierFlags {
  amount: number;
  key: string;
}

interface DetailsListingInfo {
  base: number;
  modifiers: ModifierFlags[];
  total: number;
}

/** The template data common for both executed and not executed attacks. */
type CommonWeaponAttackTemplateData = CommonWeaponAttackFlags & {
  template: {
    keys: {
      rangeBracket: string | undefined;
    };
    raw: {
      displayRanges: string;
      mainHeading: string;
      subHeading: string;
    };
  };
};

/** The data for rendering the not executed weapon attack template */
type NotExecutedAttackTemplateData = CommonWeaponAttackTemplateData &
  NotExecutedAttackFlags & {
    template: {
      keys: {
        notExecutedReason: string;
      };
    };
  };

/** The data for rendering the executed weapon attack template */
type ExecutedAttackTemplateData = CommonWeaponAttackTemplateData &
  ExecutedAttackFlags & {
    template: {
      damage: {
        results: {
          class: string;
          value: number;
        }[];
      };
      keys: {
        hit: string;
      };
    };
  };
