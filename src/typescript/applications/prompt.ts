import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/**
 * An application to prompt the user for input.
 * @typeParam Specs - the type of the input specs
 */
export default class Prompt<Specs extends InputSpecs> extends Application {
  /**
   * Get a number by prompting the user.
   * @param spec - the input specification for the Prompt
   * @param options - additional options for the Prompt
   * @returns the number if resolved or an error message if rejected
   */
  static async getNumber(
    spec: Omit<NumberInputSpec, "type">,
    options?: Partial<Application.Options>
  ): Promise<number> {
    return new Promise((resolve, reject) => {
      new this(
        { value: { type: "number", ...spec } },
        (data) => resolve(data["value"]),
        reject,
        options
      ).render(true);
    });
  }

  /**
   * Get a string by prompting the user.
   * @param spec - the input specification for the Prompt
   * @param options - additional options for the Prompt
   * @returns the string when resolved
   */
  static async getString(
    spec: Omit<TextInputSpec, "type">,
    options?: Partial<Application.Options>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      new this(
        { value: { type: "text", ...spec } },
        (data) => resolve(data["value"]),
        reject,
        options
      ).render(true);
    });
  }

  static override get defaultOptions(): Application.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "prompt"],
      template: `${CONSTANTS.systemPath}/handlebars/prompt.hbs`,
      title: getGame().i18n.localize("wv.prompt.defaults.title")
    } as typeof ActorSheet["defaultOptions"]);
  }

  /**
   * @param specs - the input specs for the Prompt
   * @param onSubmit - the callback to be executed once the user submits the
   *                   application's form
   * @param onClose - the callback to be executed once the prompt is closed
   *                  without being submitted
   * @param options - the options for the prompt
   */
  constructor(
    specs: Specs,
    onSubmit: Callback<Specs>,
    onClose: () => void,
    options?: Partial<Application.Options>
  ) {
    super(options);

    this.specs = foundry.utils.deepClone(specs);
    Object.keys(this.specs).forEach((key) => {
      this.specs[key].class = this.getClass(this.specs[key]);
    });

    this.onSubmitCallback = onSubmit;
    this.onCloseCallback = onClose;
  }

  /** The input specifications of the Prompt */
  protected specs: RenderSpecs<Specs>;

  /** The callback to run on submit */
  protected onSubmitCallback: Callback<Specs>;

  /** The callback to run on close */
  protected onCloseCallback: () => void;

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("submit", this.onSubmit.bind(this));
    html.find("input")[0].select();
  }

  override async getData(): Promise<RenderData<Specs>> {
    return { inputs: this.specs };
  }

  override async close(
    options: CloseOptions = { runCallback: true }
  ): Promise<void> {
    if (options?.runCallback) this.onCloseCallback();
    await super.close();
  }

  /** Get the css classes for the input element. */
  protected getClass(spec: InputSpec): string | undefined {
    if (
      spec.type === "number" &&
      typeof spec.max === "number" &&
      typeof spec.min === "number"
    ) {
      const maxPlaces = this.getCharWidth(spec.max);
      const minPlaces = this.getCharWidth(spec.min);
      const places = Math.max(maxPlaces, minPlaces);

      if (places.between(0, 5)) return `size-${places}`;
    }

    return;
  }

  /** Get the width in characters for a given number. */
  protected getCharWidth(number: number): number {
    return (
      Math.floor(Math.abs(number)).toString().length + (number < 0 ? 1 : 0)
    );
  }

  /**
   * Handle the submit event of the application input.
   * @param event - the submit event of the form
   */
  protected async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const values: Partial<InputSpecsReturnType<Specs>> = {};
    const data = new FormData(event.target);

    Object.keys(this.specs).forEach((key) => {
      const inputValue = data.get(key);
      if (typeof inputValue !== "string")
        throw Error(`The value of input ${key} is missing!`);

      switch (this.specs[key]["type"]) {
        case "number": {
          const value = parseInt(inputValue);
          if (isNaN(value))
            throw Error(`The input of ${key} was not a number!`);
          // @ts-expect-error TODO Fix later (string can't be used to index)
          values[key] = value;
          break;
        }
        default:
          // @ts-expect-error TODO Fix later (string can't be used to index)
          values[key] = inputValue;
      }
    });

    await this.close({ runCallback: false });
    this.onSubmitCallback(values as InputSpecsReturnType<Specs>);
  }
}

/** The render data supplied to the Prompt's Handlebars template. */
type RenderData<Specs extends InputSpecs> = {
  /** The inputs of the Prompt */
  inputs: RenderSpecs<Specs>;
};

/** An type that maps input specifications to render input specifications */
type RenderSpecs<Specs extends InputSpecs> = {
  [Key in keyof Specs]: RenderSpec<Specs[Key]>;
};

/** An type that maps an input specification to a render input specification */
type RenderSpec<Spec extends InputSpec> = Spec & {
  class?: string | undefined;
};

/** The input specifications for the Prompt */
type InputSpecs = Record<string, InputSpec>;

/** A single input specification for a Prompt */
type InputSpec = NumberInputSpec | TextInputSpec;

/** A common input specification for a Prompt */
interface CommonInputSpec {
  /** The label for the input */
  label: string;

  /** The HTML input type */
  type: string;

  /** The initial value of the input */
  value?: string | number | undefined;
}

/** A number input specification for a Prompt  */
interface NumberInputSpec extends CommonInputSpec {
  type: "number";

  /** The maximum number */
  max?: number | undefined;

  /** The minimum number */
  min?: number | undefined;

  value?: number | undefined;
}

/** An text input specification for a Prompt  */
interface TextInputSpec extends CommonInputSpec {
  type: "text";
}

/** A type that maps InputSpecs to their corresponding return types */
export type InputSpecsReturnType<Specs extends InputSpecs> = {
  [Key in keyof Specs]: InputSpecReturnType<Specs[Key]>;
};

/** A type that maps an InputSpec to its corresponding return type */
export type InputSpecReturnType<Spec extends InputSpec | undefined> =
  Spec extends undefined
    ? InputSpecReturnType<NonNullable<Spec>> | undefined
    : NonNullable<Spec>["type"] extends "number"
    ? number
    : string;

/**
 * A type for the Callback of the Prompt Application.
 * @typeParam Specs - the specs of the Prompt
 * @param data - the data gathered from the input elements
 */
export type Callback<Specs extends InputSpecs> = (
  data: InputSpecsReturnType<Specs>
) => void;

type SubmitEvent = JQuery.SubmitEvent<
  HTMLFormElement,
  unknown,
  HTMLFormElement,
  HTMLFormElement
>;

/** Close options for the Prompt */
interface CloseOptions extends Application.CloseOptions {
  /** Whether to run the close callback */
  runCallback?: boolean;
}
