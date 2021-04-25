import WvActor from "./actor/wv-actor";
import WvItem from "./item/wv-item";

Hooks.once("init", () => {
  // Register our own Entity classes.
  CONFIG.Actor.entityClass = WvActor;
  CONFIG.Item.entityClass = WvItem;
});
