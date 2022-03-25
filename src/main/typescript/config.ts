import Ajv from "ajv";
import WvActor from "./actor/wvActor.js";
import WvActorSheet from "./applications/actor/wvActorSheet.js";
import ApparelSheet from "./applications/item/apparelSheet.js";
import EffectSheet from "./applications/item/effectSheet.js";
import WeaponSheet from "./applications/item/weaponSheet.js";
import WvItemSheet from "./applications/item/wvItemSheet.js";
import { CONSTANTS, TYPES } from "./constants.js";
import { CHARACTER_JSON_SCHEMA } from "./data/actor/character/source.js";
import { AMMO_SOURCE_JSON_SCHEMA } from "./data/item/ammo/source.js";
import { APPAREL_SOURCE_JSON_SCHEMA } from "./data/item/apparel/source.js";
import { BASE_ITEM_JSON_SCHEMA } from "./data/item/baseItem.js";
import { STACK_BASE_ITEM_JSON_SCHEMA } from "./data/item/stackableBaseItem.js";
import { WEAPON_SOURCE_JSON_SCHEMA } from "./data/item/weapon/source.js";
import { getGame } from "./foundryHelpers.js";
import WvCombat from "./foundryOverrides/wvCombat.js";
import WvRuler from "./foundryOverrides/wvRuler.js";
import WvToken from "./foundryOverrides/wvToken.js";
import Apparel from "./item/apparel.js";
import Effect from "./item/effect.js";
import Weapon from "./item/weapon.js";
import WvItem from "./item/wvItem.js";
import { macros } from "./macros/index.js";
import {
  flagCriticalFailure,
  flagCriticalSuccesses
} from "./rolls/criticalsModifiers.js";
import { RULE_ELEMENT_SOURCE_JSON_SCHEMA } from "./ruleEngine/ruleElementSource.js";
import { initializedSettingName } from "./settings.js";

/** The Foundry configuration function for the init hook */
export function configureFoundryOnInit(): void {
  const ajv = new Ajv({ allErrors: true });
  getGame().wv = {
    ajv,
    macros,
    typeConstructors: {
      actor: {
        character: WvActor
      },
      item: {
        apparel: Apparel,
        effect: Effect,
        weapon: Weapon
      }
    },
    validators: {
      actor: {
        character: ajv.compile(CHARACTER_JSON_SCHEMA)
      },
      item: {
        ammo: ajv.compile(AMMO_SOURCE_JSON_SCHEMA),
        apparel: ajv.compile(APPAREL_SOURCE_JSON_SCHEMA),
        effect: ajv.compile(BASE_ITEM_JSON_SCHEMA),
        misc: ajv.compile(STACK_BASE_ITEM_JSON_SCHEMA),
        weapon: ajv.compile(WEAPON_SOURCE_JSON_SCHEMA)
      },
      ruleElement: ajv.compile(RULE_ELEMENT_SOURCE_JSON_SCHEMA)
    }
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
    label: "wv.system.sheets.names.actorSheet",
    makeDefault: true
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet(CONSTANTS.systemId, WvItemSheet, {
    label: "wv.system.sheets.names.itemSheet",
    makeDefault: true
  });
  Items.registerSheet(CONSTANTS.systemId, EffectSheet, {
    label: "wv.system.sheets.names.effectSheet",
    makeDefault: true,
    types: [TYPES.ITEM.EFFECT]
  });
  Items.registerSheet(CONSTANTS.systemId, ApparelSheet, {
    label: "wv.system.sheets.names.apparelSheet",
    makeDefault: true,
    types: [TYPES.ITEM.APPAREL]
  });
  Items.registerSheet(CONSTANTS.systemId, WeaponSheet, {
    label: "wv.system.sheets.names.weaponSheet",
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
