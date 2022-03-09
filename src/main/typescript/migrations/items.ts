import { Caliber, CONSTANTS, TYPES } from "../constants.js";
import type { AmmoDataSourceData } from "../data/item/ammo/source.js";
import type { WeaponDataSourceData } from "../data/item/weapon/source.js";
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
    } else {
      migrateAmmoFix(item);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(`Failed migration for Item [${item.id}]: ${message}`);
  }
}

async function migrateAmmoFix(item: foundry.documents.BaseItem): Promise<void> {
  if (!["ammo", "weapon"].includes(item.type)) return;
  if (item.type === "ammo") {
    const data = item.data.data as AmmoDataSourceData;
    const newCaliber = transformCaliber(data.caliber);
    if (!newCaliber) return;

    await item.update({ data: { caliber: newCaliber } });
  } else if (item.type === "weapon") {
    const data = item.data.data as WeaponDataSourceData;
    if (!data.reload) return;

    const newCaliber = transformCaliber(data.reload.caliber);
    if (!newCaliber) return;

    await item.update({
      data: { reload: { ...data.reload, caliber: newCaliber } }
    });
  }
}

function transformCaliber(caliber: string): Caliber | undefined {
  if (/^\.(?:308|44|50)cal$/.test(caliber)) {
    return caliber.substring(1) as Caliber;
  } else if (["5.56mm", "12.7mm"].includes(caliber)) {
    return caliber.replace(".", "_") as Caliber;
  }
}

async function migrateFromCompendium(
  item: foundry.documents.BaseItem
): Promise<void> {
  LOG.info(`Updating Item from Compendium [${item.id}] "${item.name}"`);
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
  if (!match || !match[1] || !match[2]) return {};

  const compendium = getGame().packs.get(match[1]);
  if (!compendium) return {};

  const document = await compendium.getDocument(match[2]);
  if (!(document instanceof WvItem)) return {};

  const updateData = { data: document.toObject().data };
  updateData.data.notes = item.data.data.notes;
  updateData.data.rules.sources = item.data.data.rules.sources;
  return updateData;
}
