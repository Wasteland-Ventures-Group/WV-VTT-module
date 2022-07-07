import type WvActor from "../../actor/wvActor.js";
import type { KnownTag } from "../../constants.js";
import WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects items with a specific tag. */
export default class TagSelector extends DocumentSelector {
  constructor(public root: WvActor | WvItem, public tag: KnownTag) {
    super(root);
  }

  selects(document: StoredDocument<WvActor | WvItem>): boolean {
    if (!(document instanceof WvItem)) return false;

    return document.data.data.tags.includes(this.tag);
  }
}
