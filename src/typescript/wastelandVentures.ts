import WvActor from "./actor/wvActor";
import WvActorSheet from "./actor/wvActorSheet";
import WvItem from "./item/wvItem";

Hooks.once("init", () => {
  // Register our own Entity classes.
  CONFIG.Actor.entityClass = WvActor;
  CONFIG.Item.entityClass = WvItem;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wastelandVentures", WvActorSheet, {
    makeDefault: true
  });
});
