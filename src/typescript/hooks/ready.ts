import { configureFoundryOnReady } from "../config.js";
import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import { migrateWorld, migrationNeeded } from "../migrations/world.js";
import { initializedSettingName } from "../settings.js";

/** Register system callbacks for the ready hook. */
export default function registerForReady(): void {
  Hooks.once("ready", ready);
}

/** Run the necessary things once foundry is ready. */
function ready(): void {
  configureFoundryOnReady();
  migrate();
  getGame().settings.set(CONSTANTS.systemId, initializedSettingName, true);
}

/** Run the system migrations, if needed. */
function migrate(): void {
  if (migrationNeeded()) {
    migrateWorld();
  }
}
