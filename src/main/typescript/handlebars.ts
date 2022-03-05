import { HANDLEBARS } from "./constants.js";

/** This registers various Handlebars helpers. */
export function registerHelpers(): void {
  Handlebars.registerHelper("get", (context, path) =>
    foundry.utils.getProperty(context, path)
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
    HANDLEBARS.partPaths.actor.background,
    HANDLEBARS.partPaths.actor.effects,
    HANDLEBARS.partPaths.actor.equipment,
    HANDLEBARS.partPaths.actor.header,
    HANDLEBARS.partPaths.actor.inventory,
    HANDLEBARS.partPaths.actor.magic,
    HANDLEBARS.partPaths.actor.stats,
    HANDLEBARS.partPaths.actor.weaponSlot,
    HANDLEBARS.partPaths.item.header,
    HANDLEBARS.partPaths.item.rules
  ]);
}
