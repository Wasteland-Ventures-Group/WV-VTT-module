import { CONSTANTS, SpecialName, SpecialNames } from "../constants.js";
import SpecialsSource from "../data/actor/common/specials/source.js";
import SystemLogger, { LOG } from "../systemLogger.js";

export default function migrateActors(currentVersion: string): void {
  if (!(game instanceof Game)) {
    LOG.error("Game was not yet initialized.");
    return;
  }

  if (!game.actors) {
    LOG.error("Actors was not yet defined.");
    return;
  }

  if (!game.scenes) {
    LOG.error("Scenes was not yet defined.");
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
    LOG.info(
      `Collecting update data for Actor ${SystemLogger.getActorIdent(actor)}`
    );
    const updateData = migrateActorData(actor);
    if (!foundry.utils.isObjectEmpty(updateData)) {
      LOG.info(
        `Migrating Actor ${SystemLogger.getActorIdent(actor)} with`,
        updateData
      );
      await actor.update(updateData, { enforceTypes: false });
      await actor.setFlag(
        CONSTANTS.systemId,
        "lastMigrationVersion",
        currentVersion
      );
    }
  } catch (err) {
    LOG.error(
      `Failed migration for Actor ${SystemLogger.getActorIdent(actor)}.`,
      err
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
  migrateToCompositeNumbers(actor, updateData);
  migrateRace(actor, updateData);

  return updateData;
}

function migrateVitalsToResources(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  const vitals = actor.data._source.data.vitals;
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
  if (actor.data._source.type !== "character") {
    return;
  }
  if ("history" in actor.data._source.data.background)
    updateData["data.background.-=history"] = null;
}

function migrateSpecials(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
): void {
  const sourceData = actor.data._source.data;
  if (!("specials" in sourceData)) return;
  if (sourceData.specials instanceof SpecialsSource) {
    return;
  }

  // for some reason, the typechecker won't accept the cast otherwise
  const specials = (
    sourceData as unknown as { specials: Record<SpecialName, number> }
  ).specials;

  for (const special of SpecialNames) {
    if (typeof specials?.[special] === "number") {
      updateData[`data.leveling.specialPoints.${special}`] = specials[special];
    }
  }

  updateData["data.-=specials"] = null;
}

function migrateToCompositeNumbers(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
) {
  if (actor.data._source.type !== "character") {
    return;
  }
  const background = actor.data._source.data.background;
  if (typeof background.size === "number")
    updateData["data.background.size.source"] = background.size;
}

function migrateRace(
  actor: foundry.documents.BaseActor,
  updateData: Record<string, unknown>
) {
  if (actor.data._source.type !== "character") {
    return;
  }
  const background = actor.data._source.data.background as unknown as {
    raceName: string;
  };
  if (typeof background.raceName === "string") {
    updateData["data.background.-=raceName"] = null;
  }
}
