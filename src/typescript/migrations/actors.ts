import { CONSTANTS } from "../constants.js";
import { isNewerVersionThanLast } from "./world.js";

export async function migrateActors(): Promise<void> {
  if (!game.actors) {
    console.error("Actors was not yet defined!");
    return;
  }

  for (const actor of game.actors.entities) {
    try {
      const updateData = migrateActorData(actor.data);
      if (!isObjectEmpty(updateData)) {
        console.log(`Migrating Actor entity ${actor.name}`);
        await actor.update(updateData, { enforceTypes: false });
      }
    } catch (err) {
      console.error(
        `Failed ${CONSTANTS.systemName} system migration for Actor ${actor.name}: ${err.message}`
      );
    }
  }
}

function migrateActorData(oldActorData: Actor.Data): Record<string, unknown> {
  const updateData = {};

  migrateTo_0_3_0(oldActorData, updateData);

  return updateData;
}

function migrateTo_0_3_0(
  oldActorData: Actor.Data<Pre_0_3_0_Actor>,
  updateData: Record<string, unknown>
): void {
  if (!isNewerVersionThanLast("0.2.0")) return;

  console.log(`Migrating to 0.2.0`);

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
