import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/** An application to prompt the user for input. */
export default class Prompt extends Application<Options> {
  /**
   * Get a number by prompting the user.
   * @param options - additional options for the Prompt
   * @returns the number if resolved or an Error if rejected
   */
  static async getNumber(options?: Partial<Options>): Promise<number> {
    return new Promise((resolve, reject) =>
      new this((value) => {
        const number = parseInt(value);
        isNaN(number) ? reject("The input was not a number!") : resolve(number);
      }, options).render(true)
    );
  }

  static override get defaultOptions(): Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "prompt"],
      template: `${CONSTANTS.systemPath}/handlebars/prompt.hbs`,
      title: getGame().i18n.localize("wv.prompt.defaults.title")
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @param callback - the callback to be executed once the user submits the
   *                   application's form
   * @param options - the options for the prompt
   */
  constructor(callback: Callback, options?: Partial<Options>) {
    super(options);
    this.callback = callback;
  }

  /** The callback to run on submit. */
  private callback: Callback;

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

    const input = event.target.elements.namedItem("input");
    if (input instanceof HTMLInputElement) {
      this.callback(input.value);
      this.close();
    } else {
      throw `The modifier element is not an HTMLInputElement.`;
    }
  }
}

/** This is the data supplied to the handlebars template. */
interface DialogData {
  /**
   * The description for the input of the dialog. When undefined, a generic
   * description is used.
   */
  description?: string | undefined;

  /** The maximum value for the input. */
  max?: number | undefined;

  /** The minimum value for the input. */
  min?: number | undefined;
}

/** These are the options for the Prompt. */
interface Options extends Application.Options {
  /** An optional description for the dialog. */
  description?: string;

  /** An optional max value for the modifier. */
  max?: number;

  /** An optional min value for the modifier. */
  min?: number;
}

/**
 * A type for the Callback of the Prompt Application.
 * @param value - the value of the input element
 */
type Callback = (value: string) => void;

type SubmitEvent = JQuery.SubmitEvent<
  HTMLFormElement,
  unknown,
  HTMLFormElement,
  HTMLFormElement
>;
