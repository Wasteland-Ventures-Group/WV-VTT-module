import WvActor from "../../actor/wvActor.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects only actors. */
export default class ActorSelector extends DocumentSelector {
  selects(document: StoredDocument<WvItem | WvActor>): boolean {
    return document instanceof WvActor;
  }
}
