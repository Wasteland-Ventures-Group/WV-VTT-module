import { configureFoundryOnInit } from "../config.js";
import { registerSystemSettings } from "../settings.js";
import * as handlebars from "../handlebars.js";
import registerTestBatches from "../integrations/quench/registerBatches.js";

/** Register system callbacks for the init hook. */
export default function registerForInit(): void {
  Hooks.once("init", init);
}

/** Run the necessary system initialization. */
function init(): void {
  configureFoundryOnInit();
  handlebars.registerHelpers();
  handlebars.preloadTemplates();
  registerSystemSettings();
  registerTestBatches();
}
