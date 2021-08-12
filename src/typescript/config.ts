import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./applications/actor/wvActorSheet.js";
import { CONSTANTS, TYPES } from "./constants.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import Effect from "./item/effect.js";
import WvItem from "./item/wvItem.js";

export function configureFoundry(): void {
  // Register our own Entity classes.
  CONFIG.Actor.documentClass = WvActor;
  CONFIG.Item.documentClass = WvItem;

  // Register our override classes.
  CONFIG.Combat.documentClass = WvCombat;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(CONSTANTS.systemId, WvActorSheet, {
    label: "wv.sheet.names.actorSheet",
    makeDefault: true
  });
}

/** A collection of mappings foundry template types to class constructors. */
export const TYPE_CONSTRUCTORS: TypeConstructorMaps = {
  /** A mapping of foundry item actor to class constructors. */
  ACTORS: {},
  /** A mapping of foundry item types to class constructors. */
  ITEMS: {
    [TYPES.ITEM.EFFECT]: Effect
  }
};

interface TypeConstructorMaps {
  ACTORS: ActorTypeConstructorMap;
  ITEMS: ItemTypeConstructorMap;
}
type ActorTypeConstructorMap = Partial<
  Record<ValueOf<typeof TYPES.ACTOR>, ConstructorOf<WvActor>>
>;
type ItemTypeConstructorMap = Partial<
  Record<ValueOf<typeof TYPES.ITEM>, ConstructorOf<WvItem>>
>;
