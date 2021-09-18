import { migrateWorld, migrationNeeded } from "../migrations/world.js";

/** Register system callbacks for the ready hook. */
export default function registerForReady(): void {
  Hooks.once("ready", migrate);
}

/** Run the system migrations, if needed. */
function migrate(): void {
  if (migrationNeeded()) {
    migrateWorld();
  }
}
