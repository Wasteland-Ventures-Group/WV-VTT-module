import { CONSTANTS, TYPES } from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import WvItem from "../item/wvItem.js";
import { LOG } from "../systemLogger.js";

/**
 * An array of item types, which use their base data out of prototype items
 * from the system's compendiums.
 */
const PROTO_ITEM_TYPES: ValueOf<typeof TYPES.ITEM>[] = [TYPES.ITEM.WEAPON];

export default async function migrateItems(): Promise<void> {
  if (!(game instanceof Game)) {
    LOG.error("Game was not yet initialized!");
    return;
  }

  if (!game.actors) {
    LOG.error("Actors was not yet defined!");
    return;
  }

  if (!game.items) {
    LOG.error("Items was not yet defined!");
    return;
  }

  if (!game.scenes) {
    LOG.error("Scenes was not yet defined!");
    return;
  }

  for (const item of game.items) {
    migrateItem(item);
  }

  for (const actor of game.actors) {
    for (const item of actor.items) {
      migrateItem(item);
    }
  }

  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.data.actorLink) continue;
      if (!token.actor) continue;

      for (const item of token.actor.items) {
        migrateItem(item);
      }
    }
  }
}

async function migrateItem(item: foundry.documents.BaseItem): Promise<void> {
  try {
    if (PROTO_ITEM_TYPES.includes(item.data.type)) {
      migrateFromCompendium(item);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(`Failed migration for Actor ${item.id}: ${message}`);
  }
}

async function migrateFromCompendium(
  item: foundry.documents.BaseItem
): Promise<void> {
  LOG.info(`Migrating Item ${item.name}. id=${item.id}`);
  await item.update(await getUpdateDataFromCompendium(item), {
    recursive: false,
    diff: false
  });
}

async function getUpdateDataFromCompendium(
  item: foundry.documents.BaseItem
): Promise<Record<string, unknown>> {
  const sourceId = foundry.utils.getProperty(item.data.flags, "core.sourceId");
  if (typeof sourceId !== "string") return {};

  const regex = new RegExp(
    `^Compendium\\.(${CONSTANTS.systemId}\\.\\w+)\\.([a-zA-Z0-9]{16})$`
  );
  const match = regex.exec(sourceId);
  if (!match) return {};

  const compendium = getGame().packs.get(match[1]);
  if (!compendium) return {};

  const document = await compendium.getDocument(match[2]);
  if (!(document instanceof WvItem)) return {};

  const updateData = { data: document.toObject().data };
  updateData.data.notes = item.data.data.notes;
  updateData.data.rules.sources = item.data.data.rules.sources;
  return updateData;
}
