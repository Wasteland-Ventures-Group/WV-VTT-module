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
      title: getGame().i18n.localize("wv.rolls.modifierTitle")
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
    return {
      description: this.options.description,
      max: this.options.max,
      min: this.options.min
    };
  }

  /**
   * Handle the submit event of the application input.
   * @param event - the submit event of the form
   */
  protected onSubmit(event: SubmitEvent): void {
    event.preventDefault();

    const input = event.target.elements.namedItem("modifier");
    if (input instanceof HTMLInputElement) {
      this.callback(parseInt(input.value));
      this.close();
    } else {
      throw `The modifier element is not an HTMLInputElement.`;
    }
  }
}

/**
 * This is the data supplied to the handlebars template.
 */
interface DialogData {
  /**
   * The description for the input of the dialog. When undefined, a generic
   * description is used.
   */
  description?: string | undefined;

  /**
   * The maximum value for the input.
   */
  max?: number | undefined;

  /**
   * The minimum value for the input.
   */
  min?: number | undefined;
}

/**
 * These are the options for the RollModifierDialog.
 */
interface Options extends Application.Options {
  /**
   * An optional description for the dialog.
   */
  description?: string;

  /**
   * An optional max value for the modifier.
   */
  max?: number;

  /**
   * An optional min value for the modifier.
   */
  min?: number;
}

type SubmitEvent = JQuery.SubmitEvent<
  HTMLFormElement,
  unknown,
  HTMLFormElement,
  HTMLFormElement
>;
