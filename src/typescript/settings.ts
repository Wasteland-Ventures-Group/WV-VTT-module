import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";

export const migrVerSettingName = "systemMigrationVersion";
export const boundsSettingNames = {
  skills: {
    points: {
      min: "bounds.skills.points.min"
    }
  },
  special: {
    points: {
      min: "bounds.special.points.min"
    }
  }
};

export function registerSystemSettings(): void {
  const settings = getGame().settings;

  /** Track the system version of the last migration */
  settings.register(CONSTANTS.systemId, migrVerSettingName, {
    config: false,
    default: "",
    name: "System Migration Version",
    scope: "world",
    type: String
  });

  settings.register(CONSTANTS.systemId, boundsSettingNames.skills.points.min, {
    config: true,
    default: CONSTANTS.bounds.skills.points.min,
    name: "Skill Points minimum bound",
    scope: "world",
    type: Number
  });

  settings.register(CONSTANTS.systemId, boundsSettingNames.special.points.min, {
    config: true,
    default: CONSTANTS.bounds.special.points.min,
    name: "SPECIAL Points minimum bound",
    scope: "world",
    type: Number
  });
}
