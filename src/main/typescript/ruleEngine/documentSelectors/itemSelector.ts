import type WvActor from "../../actor/wvActor.js";
import WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects only items. */
export default class ItemSelector extends DocumentSelector {
  override selects(document: WvItem | WvActor): boolean {
    return document instanceof WvItem;
  }
}
