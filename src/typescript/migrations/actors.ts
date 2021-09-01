import { LOG } from "../systemLogger.js";
import { isNewerVersionThanLast } from "./world.js";

export async function migrateActors(): Promise<void> {
  if (!(game instanceof Game)) {
    LOG.error("Game was not yet initialized!");
    return;
  }

  if (!game.actors) {
    LOG.error("Actors was not yet defined!");
    return;
  }

  for (const actor of game.actors) {
    try {
      const updateData = migrateActorData(actor.toObject());
      if (!foundry.utils.isObjectEmpty(updateData)) {
        console.log(`Migrating Actor ${actor.name}`);
        await actor.update(updateData, { enforceTypes: false });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(
        `Failed ${CONSTANTS.systemName} system migration for Actor ${actor.name}: ${message}`
      );
    }
  }
}

function migrateActorData(
  oldActorData: foundry.data.ActorData["_source"]
): Record<string, unknown> {
  const updateData = {};

  migrateTo_0_3_0(oldActorData, updateData);

  return updateData;
}

function migrateTo_0_3_0(
  oldActorData: { data: Pre_0_3_0_Actor },
  updateData: Record<string, unknown>
): void {
  if (!isNewerVersionThanLast("0.2.0")) return;

  LOG.info(`Migrating to 0.3.0`);

  const oldVitals = oldActorData.data.vitals;
  if (typeof oldVitals?.actionPoints === "number") {
    updateData["data.vitals.actionPoints.value"] = oldVitals.actionPoints;
  }
  if (typeof oldVitals?.hitPoints === "number") {
    updateData["data.vitals.hitPoints.value"] = oldVitals.hitPoints;
  }
  if (typeof oldVitals?.insanity === "number") {
    updateData["data.vitals.insanity.value"] = oldVitals.insanity;
  }
  if (typeof oldVitals?.strain === "number") {
    updateData["data.vitals.strain.value"] = oldVitals.strain;
  }
}

interface Pre_0_3_0_Actor {
  vitals?: {
    actionPoints?: number;
    hitPoints?: number;
    insanity?: number;
    strain?: number;
  };
}
