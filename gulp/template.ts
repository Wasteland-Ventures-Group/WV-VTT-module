import { promises as fs } from "fs";
import type { z } from "zod";
import { distWvPrefix, templateOutPath } from "../gulpfile.js";
import { TYPES } from "../src/main/typescript/constants.js";

export default async function templateTask(): Promise<void> {
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

  const actorDocumentTypes: TemplateDocumentType[] = [
    [TYPES.ACTOR.CHARACTER, actorDbData.CHARACTER_SCHEMA]
  ];
  const itemDocumentTypes: TemplateDocumentType[] = [
    [TYPES.ITEM.AMMO, ammoSource.AMMO_SCHEMA],
    [TYPES.ITEM.APPAREL, apparelSource.APPAREL_SCHEMA],
    [TYPES.ITEM.EFFECT, effectSource.EFFECT_SCHEMA],
    [TYPES.ITEM.MAGIC, magicSource.MAGIC_SCHEMA],
    [TYPES.ITEM.MISC, miscSource.MISC_SCHEMA],
    [TYPES.ITEM.RACE, raceSource.RACE_SCHEMA],
    [TYPES.ITEM.WEAPON, weaponSource.WEAPON_SCHEMA]
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
    const typeName = actorDocumentType[0];
    const defaultSchema = actorDocumentType[1];
    template.Actor.types.push(typeName);
    template.Actor[typeName] = defaultSchema.parse({});
  });
  itemDocumentTypes.forEach((itemDocumentType) => {
    const typeName = itemDocumentType[0];
    const defaultSchema = itemDocumentType[1];
    template.Item.types.push(typeName);
    template.Item[typeName] = defaultSchema.parse({});
  });
  return template;
}

type TemplateDocumentType = [string, z.ZodDefault<z.ZodTypeAny>];

interface Template {
  Actor: DocumentTemplates;
  Item: DocumentTemplates;
}

interface DocumentTemplates extends Record<string, unknown> {
  types: string[];
}
