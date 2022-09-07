import type WvActor from "../../actor/wvActor.js";
import type { SkillName } from "../../constants.js";
import Weapon from "../../item/weapon.js";
import type WvItem from "../../item/wvItem.js";
import DocumentSelector from "../documentSelector.js";

/** A DocumentSelector that selects documents based on their used skill. */
export default class UsesSkillSelector extends DocumentSelector {
  constructor(public root: WvActor | WvItem, public skill: SkillName) {
    super(root);
  }

  override selects(document: WvActor | WvItem): boolean {
    return (
      document instanceof Weapon && document.data.data.skill === this.skill
    );
  }
}
