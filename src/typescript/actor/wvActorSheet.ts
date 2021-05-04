import { SpecialNames } from "../constants.js";
import { CONSTANTS } from "../constants.js";
import WvLocalization, { Special as I18nSpecial } from "../i18n.js";
import WvActor from "./wvActor.js";

interface Special extends I18nSpecial {
  value?: number;
}

type Specials = Partial<Record<SpecialNames, Special>>;

interface SheetData extends ActorSheet.Data<WvActor> {
  sheet?: {
    specials?: Specials;
  };
}

/**
 * The basic Wasteland Ventures Actor Sheet.
 */
export default class WvActorSheet extends ActorSheet<SheetData> {
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

  /**
   * @override
   */
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  async getData() {
    const specialI18n = WvLocalization.specials;
    const data = await super.getData();
    data.sheet = {};
    data.sheet.specials = {};
    let k: keyof typeof data.data.specials;
    for (k in data.data.specials) {
      data.sheet.specials[k] = {
        long: specialI18n[k].long,
        short: specialI18n[k].short,
        value: data.data.specials[k]
      };
    }
    return data;
  }
}
