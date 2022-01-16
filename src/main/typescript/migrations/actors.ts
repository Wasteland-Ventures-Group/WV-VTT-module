import { LOG } from "../systemLogger.js";
import { isLastMigrationOlderThan } from "./world.js";

export default async function migrateActors(): Promise<void> {
  if (!(game instanceof Game)) {
    LOG.error("Game was not yet initialized!");
    return;
  }

  if (!game.actors) {
    LOG.error("Actors was not yet defined!");
    return;
  }

  if (!game.scenes) {
    LOG.error("Scenes was not yet defined!");
    return;
  }

  for (const actor of game.actors) {
    migrateActor(actor);
  }

  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.data.actorLink) continue;
      if (!token.actor) continue;

      migrateActor(token.actor);
    }
  }
}

async function migrateActor(actor: foundry.documents.BaseActor): Promise<void> {
  try {
    LOG.info(`Collecting update data for Actor [${actor.id}] "${actor.name}"`);
    const updateData = migrateActorData(actor.toObject());
    if (!foundry.utils.isObjectEmpty(updateData)) {
      LOG.info(`Migrating Actor [${actor.id}] "${actor.name}"`);
      await actor.update(updateData, { enforceTypes: false });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(`Failed migration for Actor [${actor.id}]: ${message}`);
  }
}

function migrateActorData(
  oldActorData: foundry.data.ActorData["_source"]
): Record<string, unknown> {
  const updateData = {};

  migrateTo_0_2_0(oldActorData, updateData);

  return updateData;
}

function migrateTo_0_2_0(
  oldActorData: { data: ActorPre_0_2_0 },
  updateData: Record<string, unknown>
): void {
  if (!isLastMigrationOlderThan("0.2.0")) return;

  LOG.info(`Migrating to 0.2.0`);

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

interface ActorPre_0_2_0 {
  vitals?: {
    actionPoints?: number;
    hitPoints?: number;
    insanity?: number;
    strain?: number;
  };
}
