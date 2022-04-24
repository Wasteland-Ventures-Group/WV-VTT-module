import { CONSTANTS } from "../constants.js";
import { LOG } from "../systemLogger.js";
import { isLastMigrationOlderThan } from "./world.js";

export default function migrateActors(currentVersion: string): void {
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
    migrateActor(actor, currentVersion);
  }

  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.data.actorLink) continue;
      if (!token.actor) continue;

      migrateActor(token.actor, currentVersion);
    }
  }
}

async function migrateActor(
  actor: foundry.documents.BaseActor,
  currentVersion: string
): Promise<void> {
  try {
    LOG.info(`Collecting update data for Actor [${actor.id}] "${actor.name}"`);
    const updateData = migrateActorData(actor.toObject());
    if (!foundry.utils.isObjectEmpty(updateData)) {
      LOG.info(`Migrating Actor [${actor.id}] "${actor.name}"`);
      await actor.update(updateData, { enforceTypes: false });
      await actor.setFlag(
        CONSTANTS.systemId,
        "lastMigrationVersion",
        currentVersion
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(
      `Failed migration for Actor [${actor.id}] "${actor.name}": ${message}`
    );
  }
}

function migrateActorData(oldActorData: {
  type: string;
  data: object;
}): Record<string, unknown> {
  const updateData = {};

  migrateTo_0_2_0(oldActorData, updateData);
  migrateTo_0_10_0(oldActorData, updateData);

  return updateData;
}

interface ActorPre_0_2_0 {
  vitals?: {
    actionPoints?: number;
    hitPoints?: number;
    insanity?: number;
    strain?: number;
  };
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

interface ActorPre_0_10_0 {
  specials?: {
    strength?: number;
    perception?: number;
    endurance?: number;
    charisma?: number;
    intelligence?: number;
    agility?: number;
    luck?: number;
  };
}

function migrateTo_0_10_0(
  oldActorData: { type: string; data: ActorPre_0_10_0 },
  updateData: Record<string, unknown>
): void {
  if (!isLastMigrationOlderThan("0.10.0")) return;

  LOG.info(`Migrating to 0.10.0`);

  if (oldActorData.type === "playerCharacter") updateData["type"] = "character";

  updateData["data.background.-=history"] = null;

  const oldSpecial = oldActorData.data.specials;
  for (const special of [
    "strength",
    "perception",
    "endurance",
    "charisma",
    "intelligence",
    "agility",
    "luck"
  ] as const) {
    if (typeof oldSpecial?.[special] === "number") {
      updateData[`data.leveling.specialPoints.${special}`] =
        oldSpecial[special];
      updateData[`data.specials.-=${special}`] = null;
    }
  }
  updateData["data.-=specials"] = null;
}
