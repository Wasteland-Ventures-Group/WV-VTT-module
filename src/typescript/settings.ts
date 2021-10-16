import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";

export const migrVerSettingName = "systemMigrationVersion" as const;
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
} as const;
export const enforceApDragDropSettingName = "enforceApDragDrop" as const;
export const enforceApRulerSettingName = "enforceApRuler" as const;

export function registerSystemSettings(): void {
  const game = getGame();
  const settings = game.settings;
  const i18n = game.i18n;

  /** Track the system version of the last migration */
  settings.register(CONSTANTS.systemId, migrVerSettingName, {
    config: false,
    default: "",
    name: "System Migration Version",
    scope: "world",
    type: String
  });

  let i18nPrefix = "wv.settings.skillPointsMinBounds";
  settings.register(CONSTANTS.systemId, boundsSettingNames.skills.points.min, {
    config: true,
    default: CONSTANTS.bounds.skills.points.min,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "world",
    type: Number
  });

  i18nPrefix = "wv.settings.specialPointsMinBounds";
  settings.register(CONSTANTS.systemId, boundsSettingNames.special.points.min, {
    config: true,
    default: CONSTANTS.bounds.special.points.min,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "world",
    type: Number
  });

  i18nPrefix = "wv.settings.enforceApDragDrop";
  settings.register(CONSTANTS.systemId, enforceApDragDropSettingName, {
    choices: {
      [EnforceApSetting.DISABLED]: i18n.localize(
        `${i18nPrefix}.choices.disabled`
      ),
      [EnforceApSetting.PLAYERS]: i18n.localize(
        `${i18nPrefix}.choices.players`
      ),
      [EnforceApSetting.PLAYERS_AND_GAMEMASTER]: i18n.localize(
        `${i18nPrefix}.choices.playersAndGameMaster`
      )
    },
    config: true,
    default: EnforceApSetting.PLAYERS,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "world",
    type: Number
  });

  i18nPrefix = "wv.settings.enforceApRuler";
  settings.register(CONSTANTS.systemId, enforceApRulerSettingName, {
    choices: {
      [EnforceApSetting.DISABLED]: i18n.localize(
        `${i18nPrefix}.choices.disabled`
      ),
      [EnforceApSetting.PLAYERS]: i18n.localize(
        `${i18nPrefix}.choices.players`
      ),
      [EnforceApSetting.PLAYERS_AND_GAMEMASTER]: i18n.localize(
        `${i18nPrefix}.choices.playersAndGameMaster`
      )
    },
    config: true,
    default: EnforceApSetting.PLAYERS_AND_GAMEMASTER,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "world",
    type: Number
  });
}

export enum EnforceApSetting {
  DISABLED,
  PLAYERS,
  PLAYERS_AND_GAMEMASTER
}
