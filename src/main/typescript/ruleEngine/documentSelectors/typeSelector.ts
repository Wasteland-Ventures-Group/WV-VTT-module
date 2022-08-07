import type WvActor from "../../actor/wvActor.js";
import type { SystemDocumentType } from "../../constants.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects documents with the specified type. */
export default class TypeSelector extends DocumentSelector {
  constructor(public root: WvActor | WvItem, public type: SystemDocumentType) {
    super(root);
  }

  override selects(document: WvActor | WvItem): boolean {
    return this.type === document.type;
  }
}
