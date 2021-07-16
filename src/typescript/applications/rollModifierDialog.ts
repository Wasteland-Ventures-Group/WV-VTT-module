import { CONSTANTS } from "../constants.js";

export default class RollModifierDialog extends Application {
  static override get defaultOptions(): Application.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "roll-modifier-dialog"],
      template: `${CONSTANTS.systemPath}/handlebars/rollModifierDialog.hbs`
    } as typeof ActorSheet["defaultOptions"]);
  }

  constructor(callback: RollModifierDialog["callback"]) {
    super();
    this.callback = callback;
  }

  /**
   * The callback to run on submit.
   */
  private callback: (modifier: number) => void;

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("submit", this.onSubmit.bind(this));
    const input = html.find("input")[0];
    input.select();
  }

  /**
   * Handle the submit event of the application input.
   * @param event - the submit event of the form
   */
  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const input = event.target.elements.namedItem("modifier");
    if (input instanceof HTMLInputElement) {
      const number = parseInt(input.value);
      if (isNaN(number)) {
        throw `The value of the input is not a number: ${input.value}`;
      }
      this.callback(number);
      this.close();
    } else {
      throw `The modifier element is not an HTMLInputElement.`;
    }
  }
}

type SubmitEvent = JQuery.SubmitEvent<
  HTMLFormElement,
  unknown,
  HTMLFormElement,
  HTMLFormElement
>;
