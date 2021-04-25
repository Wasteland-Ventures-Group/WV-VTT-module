import WvActor from "./actor/wvActor";
import WvItem from "./item/wvItem";

Hooks.once("init", () => {
  // Register our own Entity classes.
  CONFIG.Actor.entityClass = WvActor;
  CONFIG.Item.entityClass = WvItem;
});
