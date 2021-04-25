import { CONSTANTS } from "../constants";
import WvActor from "./wvActor";

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
      classes: ["wasteland-ventures"],
      template: `${CONSTANTS.systemPath}/handlebars/actors/characterSheet.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
  }

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  getData() {
    return super.getData();
  }
}
