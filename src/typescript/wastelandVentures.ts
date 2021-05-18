import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./actor/wvActorSheet.js";
import { CONSTANTS } from "./constants.js";
import { WvCombat } from "./foundryOverrides/wvCombat.js";
import { DragRuler } from "./integrations/dragRuler/dragRuler.js";
import { createWvSpeedProvider } from "./integrations/dragRuler/wvSpeedProvider.js";
import WvItem from "./item/wvItem.js";
import { migrateWorld, migrationNeeded } from "./migrations/world.js";
import { registerSystemSettings } from "./settings.js";

Hooks.once("init", () => {
  // Register our own Entity classes.
  CONFIG.Actor.entityClass = WvActor;
  CONFIG.Item.entityClass = WvItem;

  // Register our override classes.
  CONFIG.Combat.entityClass = WvCombat;

  registerSystemSettings();

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("wastelandVentures", WvActorSheet, {
    makeDefault: true
  });
});

Hooks.once("ready", () => {
  if (migrationNeeded()) {
    migrateWorld();
  }
});

Hooks.once(
  "dragRuler.ready",
  (speedProvider: typeof DragRuler.SpeedProvider) => {
    if (dragRuler) {
      dragRuler.registerSystem(
        CONSTANTS.systemId,
        createWvSpeedProvider(speedProvider)
      );
    }
  }
);
