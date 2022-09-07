import type WvActor from "../../actor/wvActor.js";
import { isSiblingItem } from "../../foundryHelpers.js";
import WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/**
 * A DocumentSelector that selects documents owned by the same parent as the
 * root.
 */
export default class SiblingSelector extends DocumentSelector {
  override selects(document: WvActor | WvItem): boolean {
    return this.root instanceof WvItem && document instanceof WvItem
      ? isSiblingItem(this.root, document)
      : false;
  }
}
