import { CONSTANTS } from "../../constants.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "item-sheet"]
    } as typeof ItemSheet["defaultOptions"]);
  }

  override get template(): string {
    return `${CONSTANTS.systemPath}/handlebars/items/${this.item.data.type}Sheet.hbs`;
  }
}
