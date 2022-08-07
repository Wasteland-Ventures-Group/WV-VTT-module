import WvActor from "../../actor/wvActor.js";
import { isOwningActor } from "../../foundryHelpers.js";
import WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects the parent document of the root. */
export default class ParentSelector extends DocumentSelector {
  override selects(document: WvActor | WvItem): boolean {
    return this.root instanceof WvItem && document instanceof WvActor
      ? isOwningActor(this.root, document)
      : false;
  }
}
