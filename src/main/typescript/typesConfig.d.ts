import type Ajv from "ajv";
import type { ValidateFunction } from "ajv";
import WvActor from "./actor/wvActor.js";
import type { CONSTANTS, TYPES } from "./constants.js";
import type { CharacterDataSourceData } from "./data/actor/character/source.js";
import { WvActorDataProperties } from "./data/actor/properties.js";
import { WvActorDataSource } from "./data/actor/source.js";
import type { AmmoDataSourceData } from "./data/item/ammo/source.js";
import type { MagicDataSourceData } from "./data/item/magic/source.js";
import type { ApparelDataSourceData } from "./data/item/apparel/source.js";
import type BaseItemSource from "./data/item/common/baseItem/source.js";
import { WvItemDataProperties } from "./data/item/properties.js";
import { WvItemDataSource } from "./data/item/source.js";
import type StackableItemSource from "./data/item/common/stackableItem/source.js";
import type { WeaponDataSourceData } from "./data/item/weapon/source.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import type { SystemChatMessageFlags } from "./hooks/renderChatMessage/decorateSystemMessage/index.js";
import type Ammo from "./item/ammo.js";
import type Magic from "./item/magic.js";
import type Apparel from "./item/apparel.js";
import type Effect from "./item/effect.js";
import type Weapon from "./item/weapon.js";
import WvItem, { ItemFlags } from "./item/wvItem.js";
import { macros } from "./macros/index.js";
import type {
  Critical,
  flagCriticalFailure,
  flagCriticalSuccesses
} from "./rolls/criticalsModifiers.js";
import type RuleElementSource from "./ruleEngine/ruleElementSource.js";
import type * as settings from "./settings.js";
import type { WvI18nKey } from "./lang.js";
import type RuleElement from "./ruleEngine/ruleElement.js";
import type { RuleElementId } from "./ruleEngine/ruleElementSource.js";
import type { KeywordSelectorWord } from "./ruleEngine/documentSelectorSource.js";
import type DocumentSelector from "./ruleEngine/documentSelector.js";
import type TagSelector from "./ruleEngine/documentSelectors/tagSelector.js";
import type TypeSelector from "./ruleEngine/documentSelectors/typeSelector.js";
import type UsesSkillSelector from "./ruleEngine/documentSelectors/usesSkillSelector.js";
import type OrSelector from "./ruleEngine/documentSelectors/orSelector.js";

declare global {
  interface SourceConfig {
    Actor: WvActorDataSource;
    Item: WvItemDataSource;
  }

  interface DataConfig {
    Actor: WvActorDataProperties;
    Item: WvItemDataProperties;
  }

  interface DocumentClassConfig {
    Actor: typeof WvActor;
    Combat: typeof WvCombat;
    Item: typeof WvItem;
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
          [TYPES.ITEM.WEAPON]: typeof Weapon;
        };
      };
      /** Wasteland Ventures system data JSON validators */
      validators: {
        actor: {
          [TYPES.ACTOR.CHARACTER]: ValidateFunction<CharacterDataSourceData>;
        };
        item: {
          [TYPES.ITEM.AMMO]: ValidateFunction<AmmoDataSourceData>;
          [TYPES.ITEM.APPAREL]: ValidateFunction<ApparelDataSourceData>;
          [TYPES.ITEM.EFFECT]: ValidateFunction<BaseItemSource>;
          [TYPES.ITEM.MAGIC]: ValidateFunction<MagicDataSourceData>;
          [TYPES.ITEM.MISC]: ValidateFunction<StackableItemSource>;
          [TYPES.ITEM.WEAPON]: ValidateFunction<WeaponDataSourceData>;
        };
        ruleElement: ValidateFunction<RuleElementSource>;
      };
    };
  }

  namespace ClientSettings {
    interface Values {
      "wasteland-ventures.initialized": boolean;
      "wasteland-ventures.systemMigrationVersion": string;
      "wasteland-ventures.movement.enforceAndSubtractApForPlayers": settings.AlwaysNeverSetting;
      "wasteland-ventures.movement.enforceApForGameMasters": settings.AlwaysNeverSetting;
      "wasteland-ventures.movement.subtractApForGameMasters": settings.AlwaysNeverSetting;
    }
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

  namespace Die {
    interface Modifiers {
      fcs: typeof flagCriticalSuccesses;
      fcf: typeof flagCriticalFailure;
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
