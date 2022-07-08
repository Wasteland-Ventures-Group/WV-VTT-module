import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/**
 * A DocumentSelector that selects documents owned by the same parent as the
 * root.
 */
export default class SiblingSelector extends DocumentSelector {
  override selects(document: StoredDocument<WvActor | WvItem>): boolean {
    const parent = this.rootParent;
    if (!parent) return false;
    return parent.items.has(document.id);
  }
}
