import WvActor from "./actor/wvActor.js";
import type { CONSTANTS } from "./constants.js";
import { WvActorDataProperties } from "./data/actor/actorData.js";
import { WvActorDataSource } from "./data/actor/actorDbData.js";
import { WvItemDataProperties } from "./data/item/properties.js";
import { WvItemDataSource } from "./data/item/source.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import type { SystemChatMessageFlags } from "./hooks/renderChatMessage.js";
import WvItem from "./item/wvItem.js";

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

  interface FlagConfig {
    ChatMessage: {
      [CONSTANTS.systemId]?: SystemChatMessageFlags;
    };
  }
}
