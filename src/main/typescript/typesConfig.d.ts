import WvActor from "./actor/wvActor.js";
import type { CONSTANTS } from "./constants.js";
import { WvActorDataProperties } from "./data/actor/properties.js";
import { WvActorDataSource } from "./data/actor/source.js";
import { WvItemDataProperties } from "./data/item/properties.js";
import { WvItemDataSource } from "./data/item/source.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import type { SystemChatMessageFlags } from "./hooks/renderChatMessage/decorateSystemMessage/index.js";
import WvItem from "./item/wvItem.js";
import type {
  Critical,
  flagCriticalFailure,
  flagCriticalSuccesses
} from "./rolls/criticalsModifiers.js";
import type * as settings from "./settings.js";
import { macros } from "./macros/index.js";
import type Ajv from "ajv";

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
    };
  }

  namespace ClientSettings {
    interface Values {
      "wasteland-ventures.initialized": boolean;
      "wasteland-ventures.systemMigrationVersion": string;
      "wasteland-ventures.bounds.skills.points.min": number;
      "wasteland-ventures.bounds.special.points.min": number;
      "wasteland-ventures.enforceApDragDrop": settings.EnforceApSetting;
      "wasteland-ventures.enforceApRuler": settings.EnforceApSetting;

      "core.defaultToken":
        | {
            bar1: { attribute: string };
            bar2: { attribute: string };
          }
        | Record<string, never>;
    }
  }

  interface FlagConfig {
    ChatMessage: {
      [CONSTANTS.systemId]?: SystemChatMessageFlags;
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
}
