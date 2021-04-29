import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./actor/wvActorSheet.js";
import WvItem from "./item/wvItem.js";

Hooks.once("init", () => {
  // Register our own Entity classes.
  CONFIG.Actor.entityClass = WvActor;
  CONFIG.Item.entityClass = WvItem;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wastelandVentures", WvActorSheet, {
    makeDefault: true
  });
});
