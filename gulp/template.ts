import { promises as fs } from "fs";
import { distWvPrefix, templateOutPath } from "../gulpfile.js";
import { TYPES } from "../src/main/typescript/constants.js";

export default async function templateTask(): Promise<void> {
  // We somehow have to get TS to reimport the files each time. Currently they
  // are only loaded the first time and then cached.
  const imports = Promise.all([
    import("../src/main/typescript/data/actor/character/source.js"),
    import("../src/main/typescript/data/item/ammo/source.js"),
    import("../src/main/typescript/data/item/effect/source.js"),
    import("../src/main/typescript/data/item/weapon/source.js")
  ]);
  await fs.mkdir(distWvPrefix, { recursive: true });
  const [actorDbData, ammoSource, effectSource, weaponSource] = await imports;

  const actorDocumentTypes: TemplateDocumentType[] = [
    [TYPES.ACTOR.CHARACTER, new actorDbData.CharacterDataSourceData()]
  ];
  const itemDocumentTypes: TemplateDocumentType[] = [
    [TYPES.ITEM.AMMO, new ammoSource.AmmoDataSourceData()],
    [TYPES.ITEM.EFFECT, new effectSource.EffectDataSourceData()],
    [TYPES.ITEM.WEAPON, new weaponSource.WeaponDataSourceData()]
  ];
  return fs.writeFile(
    templateOutPath,
    JSON.stringify(createTemplateObject(actorDocumentTypes, itemDocumentTypes))
  );
}
templateTask.description = "Generate the template.json file";

function createTemplateObject(
  actorDocumentTypes: TemplateDocumentType[],
  itemDocumentTypes: TemplateDocumentType[]
): Template {
  const template: Template = {
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

type TemplateDocumentType = [string, object];

interface Template {
  Actor: DocumentTemplates;
  Item: DocumentTemplates;
}

interface DocumentTemplates extends Record<string, unknown> {
  types: string[];
}
