import type { DragRuler } from "./integrations/dragRuler/dragRuler.js";
import { configureFoundry } from "./config.js";
import { CONSTANTS } from "./constants.js";
import { createWvSpeedProvider } from "./integrations/dragRuler/wvSpeedProvider.js";
import { migrateWorld, migrationNeeded } from "./migrations/world.js";
import { registerSystemSettings } from "./settings.js";
import * as handlebars from "./handlebars.js";

Hooks.once("init", () => {
  configureFoundry();
  handlebars.registerHelpers();
  handlebars.preloadTemplates();
  registerSystemSettings();
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
