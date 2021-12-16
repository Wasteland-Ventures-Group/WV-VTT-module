import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./applications/actor/wvActorSheet.js";
import EffectSheet from "./applications/item/effectSheet.js";
import WeaponSheet from "./applications/item/weaponSheet.js";
import { CONSTANTS, TYPES } from "./constants.js";
import { getGame } from "./foundryHelpers.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import WvRuler from "./foundryOverrides/wvRuler.js";
import WvToken from "./foundryOverrides/wvToken.js";
import WvItem from "./item/wvItem.js";
import { macros } from "./macros/index.js";
import {
  flagCriticalFailure,
  flagCriticalSuccesses
} from "./rolls/criticalsModifiers.js";
import { initializedSettingName } from "./settings.js";

/** The Foundry configuration function for the init hook */
export function configureFoundryOnInit(): void {
  getGame().wv = {
    macros
  };

  // Register our own Document classes.
  CONFIG.Actor.documentClass = WvActor;
  CONFIG.Item.documentClass = WvItem;

  // Register our override classes.
  CONFIG.Combat.documentClass = WvCombat;
  CONFIG.Token.objectClass = WvToken;
  // @ts-expect-error This is currently the only way to override Ruler
  Ruler = WvRuler;

  // Register our dice modifiers.
  Die.MODIFIERS.fcf = flagCriticalFailure;
  Die.MODIFIERS.fcs = flagCriticalSuccesses;

  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet(CONSTANTS.systemId, WvActorSheet, {
    label: "wv.sheets.common.names.actorSheet",
    makeDefault: true
  });

  Items.registerSheet(CONSTANTS.systemId, EffectSheet, {
    label: "wv.sheets.common.names.effectSheet",
    makeDefault: true,
    types: [TYPES.ITEM.EFFECT]
  });
  Items.registerSheet(CONSTANTS.systemId, WeaponSheet, {
    label: "wv.sheets.common.names.weaponSheet",
    makeDefault: true,
    types: [TYPES.ITEM.WEAPON]
  });
}

/** The Foundry configuration function for the ready hook */
export function configureFoundryOnReady(): void {
  configureDefaultResources();
}

function configureDefaultResources(): void {
  const settings = getGame().settings;
  if (!settings.get(CONSTANTS.systemId, initializedSettingName)) {
    configureCombatResource();
  }
}

/** Configure the default combat resource setting. */
function configureCombatResource(): void {
  getGame().settings.set("core", Combat.CONFIG_SETTING, {
    resource: "vitals.actionPoints.value",
    skipDefeated: true
  });
}
