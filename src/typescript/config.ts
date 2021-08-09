import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./applications/actor/wvActorSheet.js";
import { CONSTANTS } from "./constants.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
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
