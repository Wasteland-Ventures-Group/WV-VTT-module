import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./applications/actor/wvActorSheet.js";
import EffectSheet from "./applications/item/effectSheet.js";
import WeaponSheet from "./applications/item/weaponSheet.js";
import { CONSTANTS, TYPES } from "./constants.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import WvItem from "./item/wvItem.js";

export function configureFoundry(): void {
  // Register our own Document classes.
  CONFIG.Actor.documentClass = WvActor;
  CONFIG.Item.documentClass = WvItem;

  // Register our override classes.
  CONFIG.Combat.documentClass = WvCombat;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(CONSTANTS.systemId, WvActorSheet, {
    label: "wv.sheets.common.names.actorSheet",
    makeDefault: true
  });

  Items.registerSheet(CONSTANTS.systemId, EffectSheet, {
    label: "wv.sheets.common.names.effectSheet",
    types: [TYPES.ITEM.EFFECT]
  });
  Items.registerSheet(CONSTANTS.systemId, WeaponSheet, {
    label: "wv.sheets.names.weaponSheet",
    types: [TYPES.ITEM.WEAPON]
  });
}
