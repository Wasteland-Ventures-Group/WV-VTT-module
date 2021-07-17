import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/**
 * An application to prompt the user for a roll modifier.
 */
export default class RollModifierDialog extends Application<Options> {
  static override get defaultOptions(): Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "roll-modifier-dialog"],
      template: `${CONSTANTS.systemPath}/handlebars/rollModifierDialog.hbs`,
      title: getGame().i18n.localize("wv.labels.rolls.modifierTitle")
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @param callback - the callback to be executed once the user submits the
   *                   application's form
   * @param options - futher options passed along to the superclass
   */
  constructor(
    callback: RollModifierDialog["callback"],
    options?: Partial<Options>
  ) {
    super(options);
    this.callback = callback;
  }

  /**
   * The callback to run on submit.
   */
  private callback: (modifier: number) => void;

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("submit", this.onSubmit.bind(this));
    html.find("input")[0].select();
  }

  override async getData(): Promise<DialogData> {
    return { description: this.options.description };
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

interface DialogData {
  /**
   * The description for the input of the dialog.
   */
  description?: string;
}

interface Options extends Application.Options {
  /**
   * An optional description for the dialog.
   */
  description?: string;
}

type SubmitEvent = JQuery.SubmitEvent<
  HTMLFormElement,
  unknown,
  HTMLFormElement,
  HTMLFormElement
>;
