import type WvActor from "../../actor/wvActor.js";
import { isSpecialName } from "../../constants.js";
import { Special } from "../../data/actor/character/specials/properties.js";
import type WvItem from "../../item/wvItem.js";
import NotActorMessage from "../messages/notActorMessage.js";
import WrongSpecialNameMessage from "../messages/wrongSpecialNameMessage.js";
import RuleElement from "../ruleElement.js";

/** A RuleElement that adds a temporary component to a SPECIAL. */
export default class TempSpecialComponent extends RuleElement {
  override get target(): string {
    return `specials.${this.source.target}`;
  }

  protected override validate(): void {
    super.validate();
    this.checkValueIsOfType("number");

    if (!isSpecialName(this.source.target)) {
      this.messages.push(new WrongSpecialNameMessage());
    }
  }

  protected override validateAgainstDocument(document: WvActor | WvItem): void {
    if (document instanceof Actor) return;

    this.addDocumentMessage(document, new NotActorMessage());
  }

  protected override innerApply(document: WvActor | WvItem): void {
    if (typeof this.value !== "number") return;

    this.mapProperties(document, (value) => {
      if (!(value instanceof Special) || typeof this.value !== "number") return;

      value.addTemp({
        value: this.value,
        labelComponents: this.labelComponents
      });
    });
  }
}
