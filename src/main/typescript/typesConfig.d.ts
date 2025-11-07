import type Ajv from "ajv";
import WvActor, { CharacterSystem } from "./actor/wvActor.js";
import type { CONSTANTS, TYPES } from "./constants.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import type { SystemChatMessageFlags } from "./hooks/renderChatMessage/decorateSystemMessage/index.js";
import type Ammo from "./item/ammo.js";
import type Apparel from "./item/apparel.js";
import type Effect from "./item/effect.js";
import type Magic from "./item/magic.js";
import type Race from "./item/race.js";
import type Weapon from "./item/weapon.js";
import WvItem, { AmmoSystem, ApparelSystem, EffectSystem, ItemFlags, MagicSystem, MiscSystem, RaceSystem, WeaponSystem, } from "./item/wvItem.js";
import type { WvI18nKey } from "./lang.js";
import { macros } from "./macros/index.js";
import type {
  Critical,
} from "./rolls/criticalsModifiers.js";
import type DocumentSelector from "./ruleEngine/documentSelector.js";
import type OrSelector from "./ruleEngine/documentSelectors/orSelector.js";
import type TagSelector from "./ruleEngine/documentSelectors/tagSelector.js";
import type TypeSelector from "./ruleEngine/documentSelectors/typeSelector.js";
import type UsesSkillSelector from "./ruleEngine/documentSelectors/usesSkillSelector.js";
import type { KeywordSelectorWord } from "./ruleEngine/documentSelectorSource.js";
import type RuleElement from "./ruleEngine/ruleElement.js";
import type { RuleElementId } from "./ruleEngine/ruleElementSource.js";
import type * as settings from "./settings.js";

declare module "fvtt-types/configuration" {
  interface DocumentClassConfig {
    Actor: typeof WvActor;
    Item: typeof WvItem;
  }
  interface DataModelConfig {
    Actor: {
      character: typeof CharacterSystem;
    };
    Item: {
      ammo: typeof AmmoSystem;
      apparel: typeof ApparelSystem;
      effect: typeof EffectSystem;
      weapon: typeof WeaponSystem;
      race: typeof RaceSystem;
      magic: typeof MagicSystem;
      misc: typeof MiscSystem;
    };
  }

  interface SettingConfig {
    "wasteland-ventures.initialized": boolean;
    "wasteland-ventures.systemMigrationVersion": string;
    "wasteland-ventures.movement.enforceAndSubtractApForPlayers": settings.AlwaysNeverSetting;
    "wasteland-ventures.movement.enforceApForGameMasters": settings.AlwaysNeverSetting;
    "wasteland-ventures.movement.subtractApForGameMasters": settings.AlwaysNeverSetting;
  }
}


declare global {
  interface DocumentClassConfig {
    Combat: typeof WvCombat;
  }

  interface Game {
    /** The Wasteland Ventures property */
    wv: {
      /** A global Ajv instance for the system */
      ajv: Ajv;
      /** Wasteland Ventures macros */
      macros: typeof macros;
      ruleEngine: {
        elements: Record<RuleElementId, typeof RuleElement>;
        selectors: {
          keyword: Record<KeywordSelectorWord, typeof DocumentSelector>;
          or: typeof OrSelector;
          tag: typeof TagSelector;
          type: typeof TypeSelector;
          usesSkill: typeof UsesSkillSelector;
        };
      };
      typeConstructors: {
        actor: {
          [TYPES.ACTOR.CHARACTER]: typeof WvActor;
        };
        item: {
          [TYPES.ITEM.AMMO]: typeof Ammo;
          [TYPES.ITEM.APPAREL]: typeof Apparel;
          [TYPES.ITEM.EFFECT]: typeof Effect;
          [TYPES.ITEM.MAGIC]: typeof Magic;
          [TYPES.ITEM.RACE]: typeof Race;
          [TYPES.ITEM.WEAPON]: typeof Weapon;
        };
      };
    };
  }

  interface FlagConfig {
    ChatMessage: {
      [CONSTANTS.systemId]?: SystemFlags & SystemChatMessageFlags;
    };
    Item: {
      [CONSTANTS.systemId]?: SystemFlags & ItemFlags;
    };
  }

  namespace DiceTerm {
    interface Result {
      critical?: Critical;
    }
  }

  interface Localization {
    localize(stringId: WvI18nKey): string;
    format(stringId: WvI18nKey, data?: Record<string, unknown>): string;
  }
}

/** Common flags for system documents. */
interface SystemFlags {
  lastMigrationVersion?: string;
}
