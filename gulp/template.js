import { promises as fs } from "fs";
import { distWvPrefix, templateOutPath } from "../gulpfile.js";

/**
 * @returns {Promise<void>}
 */
export default async function templateTask() {
  // We somehow have to get TS to reimport the files each time. Currently they
  // are only loaded the first time and then cached.
  const imports = Promise.all([
    import("../src/main/typescript/data/actor/character/source.js"),
    import("../src/main/typescript/data/item/ammo/source.js"),
    import("../src/main/typescript/data/item/apparel/source.js"),
    import("../src/main/typescript/data/item/effect/source.js"),
    import("../src/main/typescript/data/item/magic/source.js"),
    import("../src/main/typescript/data/item/misc/source.js"),
    import("../src/main/typescript/data/item/race/source.js"),
    import("../src/main/typescript/data/item/weapon/source.js")
  ]);
  await fs.mkdir(distWvPrefix, { recursive: true });
  const [
    actorDbData,
    ammoSource,
    apparelSource,
    effectSource,
    magicSource,
    miscSource,
    raceSource,
    weaponSource
  ] = await imports;

  /**
   * @type {TemplateDocumentType[]}
   */
  const actorDocumentTypes = [
    ["character", new actorDbData.CharacterDataSourceData()]
  ];

  /**
   * @type {TemplateDocumentType[]}
   */
  const itemDocumentTypes = [
    ["ammo", new ammoSource.AmmoDataSourceData()],
    ["apparel", new apparelSource.ApparelDataSourceData()],
    ["effect", new effectSource.EffectDataSourceData()],
    ["magic", new magicSource.MagicDataSourceData()],
    ["misc", new miscSource.MiscDataSourceData()],
    ["race", new raceSource.RaceDataSourceData()],
    ["weapon", new weaponSource.WeaponDataSourceData()]
  ];

  return fs.writeFile(
    templateOutPath,
    JSON.stringify(createTemplateObject(actorDocumentTypes, itemDocumentTypes))
  );
}
templateTask.description = "Generate the template.json file";

/**
 * @param {TemplateDocumentType[]} actorDocumentTypes
 * @param {TemplateDocumentType[]} itemDocumentTypes
 * @returns {Template}
 */
function createTemplateObject(actorDocumentTypes, itemDocumentTypes) {
  /**
   * @type {Template}
   */
  const template = {
    Actor: {
      types: []
    },
    Item: {
      types: []
    }
  };
  actorDocumentTypes.forEach((actorDocumentType) => {
    template.Actor.types.push(actorDocumentType[0]);
    template.Actor[actorDocumentType[0]] = actorDocumentType[1];
  });
  itemDocumentTypes.forEach((itemDocumentType) => {
    template.Item.types.push(itemDocumentType[0]);
    template.Item[itemDocumentType[0]] = itemDocumentType[1];
  });
  return template;
}

/**
 * @typedef {[string, unknown]} TemplateDocumentType
 */

/**
 * @typedef {Object} Template
 * @property {DocumentTemplates} Actor
 * @property {DocumentTemplates} Item
 */

/**
 * @typedef {Object} ObjectWithTypes
 * @property {string[]} types
 */

/**
 * @typedef {Record<string, unknown> & ObjectWithTypes} DocumentTemplates
 */
