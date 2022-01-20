import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";

export const initializedSettingName = "initialized" as const;
export const migrVerSettingName = "systemMigrationVersion" as const;
export const enforceApDragDropSettingName = "enforceApDragDrop" as const;
export const enforceApRulerSettingName = "enforceApRuler" as const;

export function registerSystemSettings(): void {
  const game = getGame();
  const settings = game.settings;
  const i18n = game.i18n;

  /** Track whether the world has been initialized with some system settings. */
  settings.register(CONSTANTS.systemId, initializedSettingName, {
    config: false,
    default: false,
    name: "System Initialization Flag",
    scope: "world",
    type: Boolean
  });

  /** Track the system version of the last migration */
  settings.register(CONSTANTS.systemId, migrVerSettingName, {
    config: false,
    default: "",
    name: "System Migration Version",
    scope: "world",
    type: String
  });

  let i18nPrefix = "wv.system.settings.enforceApDragDrop";
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

  i18nPrefix = "wv.system.settings.enforceApRuler";
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
