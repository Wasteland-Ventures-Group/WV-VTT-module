import WvActor from "../actor/wvActor.js";
import { getGame } from "../foundryHelpers.js";
import type WvItem from "../item/wvItem.js";
import type { DocumentSelectorSource } from "./documentSelectorSource.js";

/** Create a DocumentSelector from a given source and a root document. */
export function createSelector(
  root: WvActor | WvItem,
  source: DocumentSelectorSource
): DocumentSelector {
  const selectors = getGame().wv.ruleEngine.selectors;
  if (typeof source === "string") {
    return new selectors.keyword[source](root);
  } else {
    return new selectors.tag(root, source.tag);
  }
}

/** A tool to select documents. */
export default class DocumentSelector {
  constructor(
    /** The document, that is the root for this selector */
    public root: WvActor | WvItem
  ) {}

  /** Get the parent of the selector root. */
  get rootParent(): WvActor | null {
    return this.root instanceof WvActor ? this.root : this.root.parent;
  }

  /** Check whether this selector selects the given document. */
  selects(_document: StoredDocument<WvActor | WvItem>): boolean {
    return false;
  }
}
