import type WvActor from "../../actor/wvActor.js";
import { isSameDocument } from "../../foundryHelpers.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that only selects its own root document. */
export default class ThisSelector extends DocumentSelector {
  override selects(document: WvItem | WvActor): boolean {
    return isSameDocument(this.root, document);
  }
}
