import { configureFoundry } from "../config.js";
import { registerSystemSettings } from "../settings.js";
import * as handlebars from "../handlebars.js";

/** Register system callbacks for the init hook. */
export default function registerForInit(): void {
  Hooks.once("init", init);
}

/** Run the necessary system initialization. */
function init(): void {
  configureFoundry();
  handlebars.registerHelpers();
  handlebars.preloadTemplates();
  registerSystemSettings();
}
