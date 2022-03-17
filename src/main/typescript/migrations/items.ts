import { Caliber, CONSTANTS, ProtoItemTypes } from "../constants.js";
import type { AmmoDataSourceData } from "../data/item/ammo/source.js";
import type { WeaponDataSourceData } from "../data/item/weapon/source.js";
import { getUpdateDataFromCompendium } from "../item/wvItem.js";
import { LOG } from "../systemLogger.js";

export default async function migrateItems(
  currentVersion: string
): Promise<void> {
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
    migrateItem(item, currentVersion);
  }

  for (const actor of game.actors) {
    for (const item of actor.items) {
      migrateItem(item, currentVersion);
    }
  }

  for (const scene of game.scenes) {
    for (const token of scene.tokens) {
      if (token.data.actorLink) continue;
      if (!token.actor) continue;

      for (const item of token.actor.items) {
        migrateItem(item, currentVersion);
      }
    }
  }
}

async function migrateItem(
  item: foundry.documents.BaseItem,
  currentVersion: string
): Promise<void> {
  try {
    const disabledLink = item.getFlag(
      CONSTANTS.systemId,
      "disableCompendiumLink"
    );
    if (disabledLink) {
      LOG.debug(
        `The item is flagged to disable the compendium link. [${item.id}] "${item.name}"`
      );
    }
    if (ProtoItemTypes.includes(item.data.type) && !disabledLink) {
      migrateFromCompendium(item, currentVersion);
    } else {
      migrateAmmoFix(item, currentVersion);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(`Failed migration for Item [${item.id}]: ${message}`);
  }
}

async function migrateAmmoFix(
  item: foundry.documents.BaseItem,
  currentVersion: string
): Promise<void> {
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
      data: { reload: { ...data.reload, caliber: newCaliber } },
      flags: { [CONSTANTS.systemId]: { lastMigrationVersion: currentVersion } }
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
  item: foundry.documents.BaseItem,
  currentVersion: string
): Promise<void> {
  LOG.info(`Updating Item from Compendium [${item.id}] "${item.name}"`);
  await item.update(
    {
      ...(await getUpdateDataFromCompendium(item)),
      flags: {
        ...item.data.flags,
        [CONSTANTS.systemId]: { lastMigrationVersion: currentVersion }
      }
    },
    {
      recursive: false,
      diff: false
    }
  );
}
