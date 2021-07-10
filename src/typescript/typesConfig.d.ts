import WvActor from "./actor/wvActor.js";
import { WvActorDataProperties } from "./data/actorData.js";
import { WvActorDataSource } from "./data/actorDbData.js";
import { WvItemDataSource } from "./data/itemDbData.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import WvItem from "./item/wvItem.js";

declare global {
  interface SourceConfig {
    Actor: WvActorDataSource;
    Item: WvItemDataSource;
  }

  interface DataConfig {
    Actor: WvActorDataProperties;
  }

  interface DocumentClassConfig {
    Actor: typeof WvActor;
    Combat: typeof WvCombat;
    Item: typeof WvItem;
  }
}
