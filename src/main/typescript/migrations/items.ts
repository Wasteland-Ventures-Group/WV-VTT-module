import { Caliber, CONSTANTS, ProtoItemTypes } from "../constants.js";
import type { AmmoDataSourceData } from "../data/item/ammo/source.js";
import type {
  DistanceSource,
  RangeSource
} from "../data/item/weapon/ranges/source.js";
import type { WeaponDataSourceData } from "../data/item/weapon/source.js";
import {
  getUpdateDataFromCompendium,
  hasEnabledCompendiumLink
} from "../item/wvItem.js";
import { LOG } from "../systemLogger.js";

export default function migrateItems(currentVersion: string): void {
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
    LOG.info(`Collecting update data for Item [${item.id}] "${item.name}"`);
    const disabledLink = item.getFlag(
      CONSTANTS.systemId,
      "disableCompendiumLink"
    );
    if (disabledLink) {
      LOG.debug(
        `The item is flagged to disable the compendium link. [${item.id}] "${item.name}"`
      );
    }

    const updateData = {};
    migrateRuleElementHook(item, updateData);

    if (
      ProtoItemTypes.includes(item.data.type) &&
      hasEnabledCompendiumLink(item)
    ) {
      await migrateFromCompendium(item, updateData, currentVersion);
    } else {
      migrateAmmoFix(item, updateData);
      migrateRanges(item, updateData);
      migrateMandatoryReload(item, updateData);
      if (!foundry.utils.isObjectEmpty(updateData)) {
        LOG.info(`Migrating Item [${item.id}] "${item.name}" with`, updateData);
        await item.update(updateData);
        await item.setFlag(
          CONSTANTS.systemId,
          "lastMigrationVersion",
          currentVersion
        );
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    LOG.error(
      `Failed migration for Item [${item.id}] "${item.name}": ${message}`
    );
  }
}

function migrateRuleElementHook(
  item: foundry.documents.BaseItem,
  updateData: Record<string, unknown>
) {
  if (item.data.data.rules.sources.some((rule) => rule.hook === undefined)) {
    updateData["data.rules.sources"] = item.data.data.rules.sources.map(
      (rule) => ({
        // @ts-expect-error This might not be there in not migrated data
        hook: "afterSpecial",
        ...rule
      })
    );
  }
}

function migrateAmmoFix(
  item: foundry.documents.BaseItem,
  updateData: Record<string, unknown>
) {
  if (!["ammo", "weapon"].includes(item.type)) return;

  if (item.type === "ammo") {
    const data = item.data.data as AmmoDataSourceData;
    const newCaliber = transformCaliber(data.caliber);
    if (!newCaliber) return;

    updateData["data.caliber"] = newCaliber;
  } else if (item.type === "weapon") {
    const data = item.data.data as WeaponDataSourceData;
    if (!data.reload) return;

    const newCaliber = transformCaliber(data.reload.caliber);
    if (!newCaliber) return;

    updateData["data.reload"] = { ...data.reload, caliber: newCaliber };
  }
}

function transformCaliber(caliber: string): Caliber | undefined {
  if (/^\.(?:308|44|50)cal$/.test(caliber)) {
    return caliber.substring(1) as Caliber;
  } else if (["5.56mm", "12.7mm"].includes(caliber)) {
    return caliber.replace(".", "_") as Caliber;
  }
}

function migrateRanges(
  item: foundry.documents.BaseItem,
  updateData: Record<string, unknown>
) {
  if (item.type !== "weapon") return;

  const data = item.data.data as WeaponDataSourceData;
  const newShortRange = transformRange(data.ranges.short);
  const newMediumRange = transformRange(data.ranges.medium);
  const newLongRange = transformRange(data.ranges.long);
  if (newShortRange) updateData["data.ranges.short"] = newShortRange;
  if (newMediumRange) updateData["data.ranges.medium"] = newMediumRange;
  if (newLongRange) updateData["data.ranges.long"] = newLongRange;
}

function transformRange(
  range:
    | (RangeSource & { distance: number | "melee" | DistanceSource })
    | undefined
): RangeSource | undefined {
  if (range === undefined) {
    return {
      distance: {
        base: 0,
        multiplier: 0,
        special: ""
      },
      modifier: 0
    };
  }

  if (range.distance === "melee") {
    return {
      distance: {
        base: 2,
        multiplier: 0,
        special: ""
      },
      modifier: range.modifier
    };
  }

  if (typeof range.distance === "number") {
    return {
      distance: {
        base: range.distance,
        multiplier: 0,
        special: ""
      },
      modifier: range.modifier
    };
  }

  return undefined;
}

function migrateMandatoryReload(
  item: foundry.documents.BaseItem,
  updateData: Record<string, unknown>
) {
  if (item.type !== "weapon") return;

  const data = item.data.data as WeaponDataSourceData;
  if (data.reload) return;

  updateData["data.reload"] = {
    ap: 0,
    caliber: "308cal",
    containerType: "magazine",
    size: 0
  };
}

async function migrateFromCompendium(
  item: foundry.documents.BaseItem,
  updateData: Record<string, unknown>,
  currentVersion: string
): Promise<void> {
  const compendiumUpdateData = await getUpdateDataFromCompendium(item);
  if (!foundry.utils.isObjectEmpty(compendiumUpdateData)) {
    LOG.info(
      `Updating Item from Compendium [${item.id}] "${item.name}" with`,
      updateData
    );
    await item.update(
      { ...compendiumUpdateData },
      { recursive: false, diff: false }
    );
    await item.setFlag(
      CONSTANTS.systemId,
      "lastMigrationVersion",
      currentVersion
    );
  }

  if (!foundry.utils.isObjectEmpty(updateData)) {
    LOG.info(`Migrating Item [${item.id}] "${item.name}" with`, updateData);
    await item.update(updateData);
    await item.setFlag(
      CONSTANTS.systemId,
      "lastMigrationVersion",
      currentVersion
    );
  }
}
