import { isSpecialName } from "../../constants.js";
import type { Special } from "../../data/actor/character/specials/properties.js";
import WrongSpecialNameMessage from "../messages/wrongSpecialNameMessage.js";
import RuleElement from "../ruleElement.js";

/** A RuleElement that adds a temporary component to a SPECIAL. */
export default class TempSpecialComponent extends RuleElement {
  protected override checkIfTargetIsValid(): void {
    if (!isSpecialName(this.source.target)) {
      this.messages.push(new WrongSpecialNameMessage());
    }
  }

  override get target(): string {
    return `specials.${this.source.target}`;
  }

  override get selectedDoc(): Actor {
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

    (this.property as Special).addTemp({
      value: this.value,
      labelComponents: this.labelComponents
    });
  }
}
