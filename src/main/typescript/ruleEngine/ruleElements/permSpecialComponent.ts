import { isSpecialName } from "../../constants.js";
import type { Special } from "../../data/actor/character/specials/properties.js";
import WrongSpecialNameMessage from "../messages/wrongSpecialNameMessage.js";
import RuleElement from "../ruleElement.js";

/** A RuleElement that adds a permanent component to a SPECIAL. */
export default class PermSpecialComponent extends RuleElement {
  protected override checkIfSelectorIsValid(): void {
    if (!isSpecialName(this.source.selector)) {
      this.messages.push(new WrongSpecialNameMessage());
    }
  }

  override get selector(): string {
    return `specials.${this.source.selector}`;
  }

  override get targetDoc(): Actor {
    if (this.item.actor === null)
      throw new Error("The actor of the RuleElement's item is null.");

    return this.item.actor;
  }

  protected override _onAfterSpecial(): void {
    this.apply();
  }

  protected override _onAfterSkills(): void {
    this.apply();
  }

  protected override _onAfterComputation(): void {
    this.apply();
  }

  protected apply(): void {
    if (typeof this.value !== "number") return;

    (this.property as Special).addPerm({
      value: this.value,
      label: this.fullLabel
    });
  }
}
