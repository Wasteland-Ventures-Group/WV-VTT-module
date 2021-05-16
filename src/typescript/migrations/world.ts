import { CONSTANTS } from "../constants.js";
import { migrVerSettingName } from "../settings.js";
import { migrateActors } from "./actors.js";

/** Check if a data migration is needed and possible. */
export function migrationNeeded(): boolean {
  if (!game.user) return false;
  if (!game.user.isGM) return false;

  return isNewerVersionThanLast(CONSTANTS.needsMigrationVersion);
}

export function isNewerVersionThanLast(version: string): boolean {
  const lastMigrVersion = game.settings.get(
    CONSTANTS.systemId,
    migrVerSettingName
  );
  // Either the last migration version is set wrong or it has never been set, so
  // the given version is newer
  if (typeof lastMigrVersion !== "string" || lastMigrVersion === "")
    return true;

  return isNewerVersion(version, lastMigrVersion);
}

/**
 * Migrate the entire world with all entities.
 * @returns A Promise which resolves once the migration completed
 */
export async function migrateWorld(): Promise<void> {
  if (ui.notifications) {
    ui.notifications.info(
      `Applying ${CONSTANTS.systemName} system migration for version ${game.system.data.version}. Please be patient and do not close your game or shut down your server.`,
      { permanent: true }
    );
  }

  await migrateActors();

  game.settings.set(
    CONSTANTS.systemId,
    migrVerSettingName,
    game.system.data.version
  );
  if (ui.notifications) {
    ui.notifications.info(
      `${CONSTANTS.systemName} system migration to version ${game.system.data.version} completed!`,
      { permanent: true }
    );
  }
}
