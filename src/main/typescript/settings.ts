import { CONSTANTS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";

export const Movement = {
  enforceAndSubtractApForPlayers: "movement.enforceAndSubtractApForPlayers",
  enforceApForGameMasters: "movement.enforceApForGameMasters",
  subtractApForGameMasters: "movement.subtractApForGameMasters"
} as const;

export const initializedSettingName = "initialized" as const;
export const migrVerSettingName = "systemMigrationVersion" as const;

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

  const alwaysNeverSettingChoices = {
    [AlwaysNeverSetting.ALWAYS]: i18n.localize(
      "wv.system.settings.alwaysNeverSetting.choices.always"
    ),
    [AlwaysNeverSetting.NEVER]: i18n.localize(
      "wv.system.settings.alwaysNeverSetting.choices.never"
    )
  };

  let i18nPrefix = "wv.system.settings.movement.enforceAndSubtractApForPlayers";
  settings.register(
    CONSTANTS.systemId,
    Movement.enforceAndSubtractApForPlayers,
    {
      choices: alwaysNeverSettingChoices,
      config: true,
      default: AlwaysNeverSetting.ALWAYS,
      hint: i18n.localize(`${i18nPrefix}.hint`),
      name: i18n.localize(`${i18nPrefix}.name`),
      scope: "world",
      type: Number
    }
  );

  i18nPrefix = "wv.system.settings.movement.enforceApForGameMasters";
  settings.register(CONSTANTS.systemId, Movement.enforceApForGameMasters, {
    choices: alwaysNeverSettingChoices,
    config: true,
    default: AlwaysNeverSetting.ALWAYS,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "client",
    type: Number
  });

  i18nPrefix = "wv.system.settings.movement.subtractApForGameMasters";
  settings.register(CONSTANTS.systemId, Movement.subtractApForGameMasters, {
    choices: alwaysNeverSettingChoices,
    config: true,
    default: AlwaysNeverSetting.ALWAYS,
    hint: i18n.localize(`${i18nPrefix}.hint`),
    name: i18n.localize(`${i18nPrefix}.name`),
    scope: "client",
    type: Number
  });
}

export enum AlwaysNeverSetting {
  ALWAYS,
  NEVER
}
