import { CONSTANTS } from "../constants.js";
import { LOG } from "../systemLogger.js";

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
    const updateData = migrateActorData(actor);
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

function migrateActorData(
  actor: foundry.documents.BaseActor
): Record<string, unknown> {
  const updateData = {};

  migrateVitalsToResources(actor, updateData);
  migratePlayerCharacterToCharacter(actor, updateData);
  removeHistory(actor, updateData);
  migrateSpecials(actor, updateData);
  migrateToModifiableNumbers(actor, updateData);

  return updateData;
}

function migrateVitalsToResources(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  const vitals = actor.data.data.vitals;
  if (typeof vitals?.actionPoints === "number")
    updateData["data.vitals.actionPoints.value"] = vitals.actionPoints;
  if (typeof vitals?.hitPoints === "number")
    updateData["data.vitals.hitPoints.value"] = vitals.hitPoints;
  if (typeof vitals?.insanity === "number")
    updateData["data.vitals.insanity.value"] = vitals.insanity;
  if (typeof vitals?.strain === "number")
    updateData["data.vitals.strain.value"] = vitals.strain;
}

function migratePlayerCharacterToCharacter(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  // @ts-expect-error This will always error, since it is no longer a valid type
  if (actor.type === "playerCharacter") {
    updateData["type"] = "character";
  }
}

function removeHistory(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  if ("history" in actor.data.data.background)
    updateData["data.background.-=history"] = null;
}

function migrateSpecials(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  const specials = actor.data.data.specials;
  for (const special of [
    "strength",
    "perception",
    "endurance",
    "charisma",
    "intelligence",
    "agility",
    "luck"
  ] as const) {
    if (typeof specials?.[special] === "number") {
      updateData[`data.leveling.specialPoints.${special}`] = specials[special];
      updateData[`data.specials.-=${special}`] = null;
    }
  }
  updateData["data.-=specials"] = null;
}

function migrateToModifiableNumbers(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
) {
  const background = actor.data.data.background;
  if (typeof background.size === "number")
    updateData["data.background.size.source"] = background.size;
}
