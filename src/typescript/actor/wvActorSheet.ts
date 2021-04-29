import { CONSTANTS } from "../constants.js";
import WvActor from "./wvActor.js";

/**
 * The basic Wasteland Ventures Actor Sheet.
 */
export default class WvActorSheet extends ActorSheet<ActorSheet.Data<WvActor>> {
  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["wasteland-ventures", "actor-sheet"],
      template: `${CONSTANTS.systemPath}/handlebars/actors/actorSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
  }
}
