import { CONSTANTS, RangeBracket } from "../../../constants.js";
import type { SerializedCompositeNumber } from "../../../data/common.js";
import { CompositeNumber } from "../../../data/common.js";
import { scrollChatToBottom } from "../../../foundryHelpers.js";
import { isRollBlindedForCurrUser } from "../../../helpers.js";
import type { Critical } from "../../../rolls/criticalsModifiers.js";
import type { HookParams } from "../index.js";
import { CommonRollFlags, getContentElement } from "./index.js";

const TEMPLATE = `${CONSTANTS.systemPath}/handlebars/chatMessages/weaponAttack.hbs`;

// TODO: add blind roll support
/** Decorate a weapon attack message. */
export default async function decorateWeaponAttack(
  flags: WeaponAttackFlags,
  html: HookParams[1]
): Promise<void> {
  html.addClass("weapon-attack");

  const content = getContentElement(html);

  const commonData: CommonWeaponAttackTemplateData = {
    ...flags,
    details: {
      ...flags.details,
      criticals: {
        failure: CompositeNumber.from(flags.details.criticals.failure),
        success: CompositeNumber.from(flags.details.criticals.success)
      },
      damage: {
        base: CompositeNumber.from(flags.details.damage.base),
        dice: CompositeNumber.from(flags.details.damage.dice)
      },
      hit: CompositeNumber.from(flags.details.success)
    },
    template: {
      keys: {
        rangeBracket: getRangeBracketKey(flags)
      },
      blinded: isRollBlindedForCurrUser(flags.blind),
      raw: {
        mainHeading:
          flags.weapon.name !== flags.weapon.system.name
            ? flags.weapon.name ?? ""
            : flags.weapon.system.name,
        subHeading:
          flags.weapon.name !== flags.weapon.system.name
            ? `${flags.weapon.system.name} - ${flags.weapon.system.attack.name}`
            : flags.weapon.system.attack.name
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
    scrollChatToBottom();
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
      },
      blinded: isRollBlindedForCurrUser(flags.blind)
    }
  };
  content.append(await renderTemplate(TEMPLATE, data));
  scrollChatToBottom();
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
  switch (flags.details.range.bracket) {
    case RangeBracket.OUT_OF_RANGE:
      return "wv.rules.range.ranges.outOfRange.long";
    case RangeBracket.LONG:
      return "wv.rules.range.ranges.long.long";
    case RangeBracket.MEDIUM:
      return "wv.rules.range.ranges.medium.long";
    case RangeBracket.SHORT:
      return "wv.rules.range.ranges.short.long";
  }
}

/** A type representing the possible weapon attack chat message flags */
export type WeaponAttackFlags = NotExecutedAttackFlags | ExecutedAttackFlags;

/** The common weapon attack chat message flags */
export type CommonWeaponAttackFlags = CommonRollFlags & {
  type: "weaponAttack";
  details: {
    ap: {
      previous: number;
      cost: number;
      remaining: number;
    };
    damage: {
      base: SerializedCompositeNumber;
      dice: SerializedCompositeNumber;
    };
    range: {
      bracket: RangeBracket;
      distance: number;
    };
  };
  weapon: {
    display: {
      ranges: string;
    };
    image: string | null;
    name: string | null;
    system: {
      attack: {
        name: string;
      };
      name: string;
    };
  };
};

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

/** The template data common for both executed and not executed attacks. */
type CommonWeaponAttackTemplateData = CommonWeaponAttackFlags & {
  details: CommonWeaponAttackFlags["details"] & {
    criticals: {
      failure: CompositeNumber;
      success: CompositeNumber;
    };
    damage: {
      base: CompositeNumber;
      dice: CompositeNumber;
    };
    hit: CompositeNumber;
  };
  template: {
    keys: {
      rangeBracket: string | undefined;
    };
    blinded: boolean;
    raw: {
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
      blinded: boolean;
    };
  };
