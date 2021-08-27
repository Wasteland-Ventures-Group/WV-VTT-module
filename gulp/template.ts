import fs from "fs";
import log from "fancy-log";
import { distWvPrefix, templateOutPath } from "../gulpfile.js";
import type { TemplateDocumentType } from "../src/typescript/data/common.js";

export default function templateTask(cb: () => void): void {
  // We somehow have to get TS to reimport the files each time. Currently they
  // are only loaded the first time and then cached.
  Promise.all([
    import("../src/typescript/data/actor/actorDbData.js"),
    import("../src/typescript/data/item/effect/source.js"),
    import("../src/typescript/data/item/weapon/source.js")
  ])
    .then(([actorDbData, effectSource, weaponSource]) => {
      const actorDocumentTypes = [
        new actorDbData.PlayerCharacterDataSourceData()
      ];
      const itemDocumentTypes = [
        new effectSource.EffectDataSourceData(),
        new weaponSource.WeaponDataSourceData()
      ];
      fs.mkdir(distWvPrefix, { recursive: true }, () => {
        fs.writeFile(
          templateOutPath,
          JSON.stringify(
            createTemplateObject(actorDocumentTypes, itemDocumentTypes)
          ),
          cb
        );
      });
    })
    .catch((reason) => log(`template generation failed: ${reason}`));
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
    template.Actor.types.push(actorDocumentType.getTypeName());
    template.Actor[actorDocumentType.getTypeName()] = actorDocumentType;
  });
  itemDocumentTypes.forEach((itemDocumentType) => {
    template.Item.types.push(itemDocumentType.getTypeName());
    template.Item[itemDocumentType.getTypeName()] = itemDocumentType;
  });
  return template;
}

interface Template {
  Actor: DocumentTemplates;
  Item: DocumentTemplates;
}

interface DocumentTemplates extends Record<string, unknown> {
  types: string[];
}
