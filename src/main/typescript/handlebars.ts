import { HANDLEBARS } from "./constants.js";
import { getGame } from "./foundryHelpers.js";
import { z } from "zod";

/** This registers various Handlebars helpers. */
export function registerHelpers(): void {
  Handlebars.registerHelper("disabled", (testValue) => {
    const result = testValue instanceof Function ? testValue() : testValue;
    return result ? "disabled" : "";
  });

  Handlebars.registerHelper(
    "selectGroupOptions",
    (optionsGroups, { hash: { selected } }) => {
      const schema = z.record(
        z.string(),
        z
          .object({
            label: z.string(),
            options: z.record(z.string(), z.string())
          })
          .strict()
      );

      const groups = schema.parse(optionsGroups);
      const selectGroupOptions: string[] = [];
      for (const group of Object.values(groups)) {
        const selectGroup: string[] = [];

        for (const [key, label] of Object.entries(group.options)) {
          const option = `<option value="${key}"${
            key === selected ? "selected" : ""
          }>${label}</option>`;
          selectGroup.push(option);
        }

        const optString = selectGroup.join("");
        const groupString = `<optgroup label="${group.label}">${optString}</groupopt>`;
        selectGroupOptions.push(groupString);
      }
      return new Handlebars.SafeString(selectGroupOptions.join(""));
    }
  );

  Handlebars.registerHelper("enrichHTML", (html) => {
    return TextEditor.enrichHTML(html, {
      secrets: getGame().user?.isGM ?? false
    });
  });

  Handlebars.registerHelper("get", (context, path) =>
    foundry.utils.getProperty(
      context,
      path instanceof Handlebars.SafeString ? path.toString() : path
    )
  );

  Handlebars.registerHelper("ternary", (testValue, ...results) => {
    const result = testValue instanceof Function ? testValue() : testValue;
    return result ? results[0] : results[1];
  });
}

/**
 * Register templates we want (mostly partials). They will be available in other
 * Handlebars templates under their file path as key.
 */
export function preloadTemplates(): void {
  loadTemplates([
    HANDLEBARS.partPaths.actor.apparelSlot,
    HANDLEBARS.partPaths.actor.background,
    HANDLEBARS.partPaths.actor.effects,
    HANDLEBARS.partPaths.actor.equipment,
    HANDLEBARS.partPaths.actor.header,
    HANDLEBARS.partPaths.actor.inventory,
    HANDLEBARS.partPaths.actor.magic,
    HANDLEBARS.partPaths.actor.stats,
    HANDLEBARS.partPaths.actor.weaponSlot,
    HANDLEBARS.partPaths.item.baseItemInputs,
    HANDLEBARS.partPaths.item.header,
    HANDLEBARS.partPaths.item.physicalItemInputs,
    HANDLEBARS.partPaths.item.rules
  ]);
}
