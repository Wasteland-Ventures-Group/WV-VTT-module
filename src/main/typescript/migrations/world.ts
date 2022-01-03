import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import { initializedSettingName, migrVerSettingName } from "../settings.js";
import migrateActors from "./actors.js";
import migrateItems from "./items.js";

/** Check if a data migration is needed and possible. */
export function migrationNeeded(): boolean {
  if (!(game instanceof Game)) return false;
  if (!game.settings.get(CONSTANTS.systemId, initializedSettingName))
    return false;
  if (!game.user) return false;
  if (!game.user.isGM) return false;

  return isNewerVersionThanLast(CONSTANTS.needsMigrationVersion);
}

/** Check if the given version is newer than the version in the setting. */
export function isNewerVersionThanLast(version: string): boolean {
  const lastMigrVersion = getGame().settings.get(
    CONSTANTS.systemId,
    migrVerSettingName
  );
  // Either the last migration version is set wrong or it has never been set, so
  // the given version is newer
  if (lastMigrVersion === "") return true;

  return isNewerVersion(version, lastMigrVersion);
}

/**
 * Migrate the entire world with all documents.
 * @returns A Promise which resolves once the migration completed
 */
export async function migrateWorld(): Promise<void> {
  if (ui.notifications) {
    ui.notifications.info(
      getGame().i18n.format("wv.migration.started", {
        systemName: CONSTANTS.systemName,
        version: getGame().system.data.version
      }),
      { permanent: true }
    );
  }

  await migrateActors();
  await migrateItems();

  setMigrationCurrentVersion();

  if (ui.notifications) {
    ui.notifications.info(
      getGame().i18n.format("wv.migration.completed", {
        systemName: CONSTANTS.systemName,
        version: getGame().system.data.version
      }),
      { permanent: true }
    );
  }
}

/** Set the migration version current system version. */
function setMigrationCurrentVersion(): void {
  getGame().settings.set(
    CONSTANTS.systemId,
    migrVerSettingName,
    getGame().system.data.version
  );
}