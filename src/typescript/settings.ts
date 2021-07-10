import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";

export const migrVerSettingName = "systemMigrationVersion";

export function registerSystemSettings(): void {
  /** Track the system version of the last migration */
  getGame().settings.register(CONSTANTS.systemId, migrVerSettingName, {
    config: false,
    default: "",
    name: "System Migration Version",
    scope: "world",
    type: String
  });
}
