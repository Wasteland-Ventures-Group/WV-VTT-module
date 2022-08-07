import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/**
 * A DocumentSelector that selects documents if any of its selectors selects the
 * document.
 */
export default class OrSelector extends DocumentSelector {
  constructor(
    public root: WvActor | WvItem,
    public selectors: DocumentSelector[]
  ) {
    super(root);
  }

  override selects(document: WvActor | WvItem): boolean {
    return this.selectors.some((selector) => selector.selects(document));
  }
}
