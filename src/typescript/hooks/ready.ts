import { migrateWorld, migrationNeeded } from "../migrations/world.js";

export default function registerForReady(): void {
  Hooks.once("ready", ready);
}

function ready(): void {
  if (migrationNeeded()) {
    migrateWorld();
  }
}
