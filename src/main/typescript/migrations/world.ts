import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import { initializedSettingName, migrVerSettingName } from "../settings.js";
import { LOG } from "../systemLogger.js";
import migrateActors from "./actors.js";
import migrateItems from "./items.js";

/** Check if a data migration is needed and possible. */
export function migrationNeeded(): boolean {
  if (!(game instanceof Game)) return false;
  if (!game.settings.get(CONSTANTS.systemId, initializedSettingName))
    return false;
  if (!game.user) return false;
  if (!game.user.isGM) return false;

  return isLastMigrationOlderThan(CONSTANTS.needsMigrationVersion);
}

/** Check if the last migration version is older than the given version. */
export function isLastMigrationOlderThan(version: string): boolean {
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
  const currentVersion = getGame().system.data.version;
  const lastMigrVersion = getGame().settings.get(
    CONSTANTS.systemId,
    migrVerSettingName
  );

  if (ui.notifications) {
    ui.notifications.info(
      getGame().i18n.format("wv.system.messages.migrationStarted", {
        systemName: CONSTANTS.systemName,
        version: getGame().system.data.version
      }),
      { permanent: true }
    );
  }
  LOG.info(
    `Migrating this world to ${currentVersion}. Last migration was ${lastMigrVersion}`
  );

  migrateActors(currentVersion);
  migrateItems(currentVersion);

  setMigrationCurrentVersion();

  if (ui.notifications) {
    ui.notifications.info(
      getGame().i18n.format("wv.system.messages.migrationCompleted", {
        systemName: CONSTANTS.systemName,
        version: getGame().system.data.version
      }),
      { permanent: true }
    );
  }
  LOG.info(`Migrated this world to ${currentVersion}.`);
}

/** Set the migration version current system version. */
function setMigrationCurrentVersion(): void {
  getGame().settings.set(
    CONSTANTS.systemId,
    migrVerSettingName,
    getGame().system.data.version
  );
}
