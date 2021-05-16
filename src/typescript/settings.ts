import { CONSTANTS } from "./constants.js";

export const migrVerSettingName = "systemMigrationVersion";

export function registerSystemSettings() {
  /** Track the system version of the last migration */
  game.settings.register(CONSTANTS.systemId, migrVerSettingName, {
    config: false,
    default: "",
    name: "System Migration Version",
    scope: "world",
    type: String
  });
}
