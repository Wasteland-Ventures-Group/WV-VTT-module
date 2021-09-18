import { configureFoundry } from "../config.js";
import { registerSystemSettings } from "../settings.js";
import * as handlebars from "../handlebars.js";

export default function registerForInit(): void {
  Hooks.once("init", init);
}

function init(): void {
  configureFoundry();
  handlebars.registerHelpers();
  handlebars.preloadTemplates();
  registerSystemSettings();
}
