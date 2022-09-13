import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

/**
 * An application to prompt the user for input.
 * @typeParam Specs - the type of the input specs
 */
export default class Prompt<Specs extends InputSpecs> extends Application {
  /**
   * Get data by prompting the user.
   * @param spec - the input specification for the Prompt
   * @param options - additional options for the Prompt
   * @returns the user input data
   * @typeParam I - the type of the input specs, the return type is derived off
   */
  static async get<I extends InputSpecs>(
    spec: I,
    options?: Partial<ApplicationOptions>
  ): Promise<InputSpecsReturnType<I>> {
    return new Promise((resolve, reject) => {
      new this(spec, (data) => resolve(data), reject, options).render(true);
    });
  }

  /**
   * Get a boolean by prompting the user.
   * @param spec - the input specification for the Prompt
   * @param options - additional options for the Prompt
   * @returns the boolean if resolved or an error message if rejected
   */
  static async getBoolean(
    spec: Omit<CheckboxInputSpec, "type">,
    options?: Partial<ApplicationOptions>
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      new this(
        { value: { type: "checkbox", ...spec } },
        (data) => resolve(data["value"]),
        reject,
        options
      ).render(true);
    });
  }

  /**
   * Get a number by prompting the user.
   * @param spec - the input specification for the Prompt
   * @param options - additional options for the Prompt
   * @returns the number if resolved or an error message if rejected
   */
  static async getNumber(
    spec: Omit<NumberInputSpec, "type">,
    options?: Partial<ApplicationOptions>
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
    options?: Partial<ApplicationOptions>
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

  static override get defaultOptions(): ApplicationOptions {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push(...[CONSTANTS.systemId, "prompt"]);
    defaultOptions.template = `${CONSTANTS.systemPath}/handlebars/prompt.hbs`;
    defaultOptions.title = getGame().i18n.localize(
      "wv.system.prompt.defaults.title"
    );
    return defaultOptions;
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
    options?: Partial<ApplicationOptions>
  ) {
    super(options);

    this.specs = foundry.utils.deepClone(specs);
    Object.keys(this.specs).forEach((key) => {
      const spec = this.specs[key];
      if (!spec) return;
      spec.class = this.getClass(spec);
    });

    this.onSubmitCallback = onSubmit;
    this.onCloseCallback = onClose;
  }

  /** The input specifications of the Prompt */
  protected specs: RenderSpecs<Specs>;

  /** The callback to run on submit */
  protected onSubmitCallback: Callback<Specs>;

  /** The callback to run on close */
  protected onCloseCallback: (reason: "closed") => void;

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("submit", this.onSubmit.bind(this));
    html.find("input")[0]?.select();
  }

  override async getData(): Promise<RenderData<Specs>> {
    return { inputs: this.specs };
  }

  override async close(
    options: CloseOptions = { runCallback: true }
  ): Promise<void> {
    if (options?.runCallback) this.onCloseCallback("closed");
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

    Object.keys(this.specs).forEach((key: keyof Specs) => {
      const inputValue = data.get(key as string);
      if (this.specs[key].type !== "checkbox" && typeof inputValue !== "string")
        throw Error(`The value of input ${String(key)} is missing.`);

      switch (this.specs[key]["type"]) {
        case "number": {
          values[key] = this.convertNumberValue(key, inputValue);
          break;
        }
        case "checkbox": {
          values[key] = this.convertCheckboxValue(key, inputValue);
          break;
        }
        default:
          values[key] = this.convertStringValue(key, inputValue);
      }
    });

    await this.close({ runCallback: false });
    this.onSubmitCallback(values as InputSpecsReturnType<Specs>);
  }

  protected convertCheckboxValue(
    key: keyof Specs,
    inputValue: FormDataEntryValue | null
  ): InputSpecReturnType<Specs[typeof key]> {
    return (inputValue === "on") as InputSpecReturnType<Specs[typeof key]>;
  }

  protected convertNumberValue(
    key: keyof Specs,
    inputValue: FormDataEntryValue | null
  ): InputSpecReturnType<Specs[typeof key]> {
    if (typeof inputValue !== "string")
      throw Error(`The value of input ${String(key)} is missing.`);

    const value = parseInt(inputValue);
    if (isNaN(value))
      throw Error(`The input of ${String(key)} was not a number.`);
    return value as InputSpecReturnType<Specs[typeof key]>;
  }

  protected convertStringValue(
    key: keyof Specs,
    inputValue: FormDataEntryValue | null
  ): InputSpecReturnType<Specs[typeof key]> {
    if (typeof inputValue !== "string")
      throw Error(`The value of input ${String(key)} is missing.`);

    return inputValue as InputSpecReturnType<Specs[typeof key]>;
  }
}

/** The render data supplied to the Prompt's Handlebars template. */
type RenderData<Specs extends InputSpecs> = {
  /** The inputs of the Prompt */
  inputs: RenderSpecs<Specs>;
};

/** A type that maps input specifications to render input specifications */
type RenderSpecs<Specs extends InputSpecs> = {
  [Key in keyof Specs]: RenderSpec<Specs[Key]>;
};

/** A type that maps an input specification to a render input specification */
type RenderSpec<Spec extends InputSpec> = Spec & {
  class?: string | undefined;
};

/** The input specifications for the Prompt */
export type InputSpecs = Record<string, InputSpec>;

/** A single input specification for a Prompt */
export type InputSpec = CheckboxInputSpec | NumberInputSpec | TextInputSpec;

/** A common input specification for a Prompt */
export interface CommonInputSpec {
  /** The label for the input */
  label: string;

  /** The HTML input type */
  type: string;

  /** The initial value of the input */
  value?: string | number | boolean | null | undefined;
}

/** A number input specification for a Prompt  */
export interface NumberInputSpec extends CommonInputSpec {
  type: "number";

  /** The maximum number */
  max?: number | undefined;

  /** The minimum number */
  min?: number | undefined;

  value?: number | null | undefined;
}

export interface CheckboxInputSpec extends CommonInputSpec {
  type: "checkbox";

  value?: boolean | null | undefined;
}

/** A text input specification for a Prompt  */
export interface TextInputSpec extends CommonInputSpec {
  type: "text";
}

/** A type that maps InputSpecs to their corresponding return types */
export type InputSpecsReturnType<Specs extends InputSpecs> = {
  [Key in keyof Specs]: InputSpecReturnType<Specs[Key]>;
};

/** A type that maps an InputSpec to its corresponding return type */
export type InputSpecReturnType<Spec extends InputSpec> =
  Spec["type"] extends "number"
    ? number
    : Spec["type"] extends "checkbox"
    ? boolean
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
// Unsure if there should be an explicit boolean here to switch between Checks and Attacks
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null
): Promise<ExternalCheckData>;
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null,
  defaultRange: number
): Promise<ExternalAttackData>;
/**
 * Creates the Prompt for the external data for a roll
 * @param title - The title of the roll
 * @param actorName - The name of the actor
 * @param defaultRange - The default range to put in the roll (only for attack rolls)
 * @returns A Prompt object
 */
export function promptRoll(
  title: string,
  actorName: string | null,
  modifierLabel: string | null,
  defaultRange?: number
): Promise<ExternalRollData> {
  const i18n = getGame().i18n;
  const commonData: PromptSpecCommon = {
    alias: {
      type: "text",
      label: i18n.localize("wv.system.misc.speakerAlias"),
      value: actorName
    },
    modifier: {
      type: "number",
      label: modifierLabel ?? i18n.localize("wv.system.misc.modifier"),
      value: 0,
      min: -100,
      max: 100
    },
    whisperToGms: {
      type: "checkbox",
      label: i18n.localize("wv.system.rolls.whisperToGms"),
      value: getGame().user?.isGM
    }
  };
  if (defaultRange !== undefined) {
    const data: PromptSpecAttack = {
      ...commonData,
      range: {
        type: "number",
        label: i18n.localize("wv.rules.range.distance.name"),
        value: defaultRange,
        min: 0,
        max: 99999
      }
    };
    return Prompt.get<PromptSpecAttack>(data, { title });
  } else {
    const data: PromptSpecCheck = {
      ...commonData
    };
    return Prompt.get<PromptSpecCheck>(data, { title });
  }
}
export type ExternalRollData = ExternalAttackData | ExternalCheckData;
/** User-provided data for rolls */
export interface ExternalRollDataCommon {
  /** An alias for the rolling actor */
  alias: string;
  /** An optional modifier for the roll */
  modifier: number;
  /** Whether or not to whisper to GMs */
  whisperToGms: boolean;
}

export type ExternalAttackData = ExternalRollDataCommon & {
  /** The range to the target in metres */
  range: number;
};
export type ExternalCheckData = ExternalRollDataCommon;

/** The Prompt input spec for a general roll */
export type PromptSpecCommon = {
  alias: TextInputSpec;
  modifier: NumberInputSpec;
  whisperToGms: CheckboxInputSpec;
};

export type PromptSpecCheck = PromptSpecCommon;
export type PromptSpecAttack = PromptSpecCommon & {
  range: NumberInputSpec;
};
