import type WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that only selects its own root document. */
export default class ThisSelector extends DocumentSelector {
  override selects(document: StoredDocument<WvItem | WvActor>): boolean {
    return this.root.id === document.id;
  }
}
