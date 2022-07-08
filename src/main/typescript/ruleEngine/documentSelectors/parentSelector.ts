import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects the parent document of the root. */
export default class ParentSelector extends DocumentSelector {
  override selects(document: StoredDocument<WvActor | WvItem>): boolean {
    const parent = this.rootParent;
    if (!parent) return false;
    return parent.id === document.id;
  }
}
