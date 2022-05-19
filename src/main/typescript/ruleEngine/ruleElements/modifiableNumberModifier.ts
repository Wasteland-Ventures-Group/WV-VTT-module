import { getTotal, ModifiableNumber } from "../../data/common.js";
import NotModifiableNumberMessage from "../messages/notModifiableNumberMessage.js";
import RuleElement from "../ruleElement.js";

export default class ModifiableNumberModifier extends RuleElement {
  protected override validate(): void {
    super.validate();

    if (this.hasErrors()) return;

    this.checkSelectedIsModifiableNumber();
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

  protected checkSelectedIsModifiableNumber() {
    const property = foundry.utils.getProperty(
      this.targetDoc.data.data,
      this.selector
    );

    let isModifiableNumber = false;

    if (typeof property === "object") {
      if ("source" in property && typeof property.source === "number") {
        isModifiableNumber = true;
      }

      if (
        "total" in property &&
        property.total !== undefined &&
        typeof property.total !== "number"
      ) {
        isModifiableNumber = false;
      }
    }

    if (!isModifiableNumber) {
      this.messages.push(
        new NotModifiableNumberMessage(this.targetName, this.selector)
      );
    }
  }

  /** Apply the rule element to the target Document. */
  protected apply(): void {
    if (typeof this.value !== "number") return;

    const oldModNumber: ModifiableNumber = foundry.utils.getProperty(
      this.targetDoc.data.data,
      this.selector
    );

    const oldValue = getTotal(oldModNumber);
    const newValue = oldValue + this.value;

    foundry.utils.setProperty(this.targetDoc.data.data, this.selector, {
      ...oldModNumber,
      total: newValue
    });
  }
}
