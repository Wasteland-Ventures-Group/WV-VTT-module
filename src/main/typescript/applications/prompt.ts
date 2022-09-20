import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";

type DICE_ROLL_MODES = ValueOf<typeof CONST.DICE_ROLL_MODES>;
/**
 * An application to prompt the user for input.
 * @typeParam Specs - the type of the input specs
 */
export abstract class RollPrompt extends Application {
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
   * @param onSubmit - the callback to be executed once the user submits the
   *                   application's form
   * @param onClose - the callback to be executed once the prompt is closed
   *                  without being submitted
   * @param options - the options for the prompt
   */
  constructor(
    onSubmit: (data: never) => void,
    onClose: () => void,
    data: RollPromptConstructorData,
    options?: Partial<ApplicationOptions>
  ) {
    super(options);

    this.onSubmitCallback = onSubmit;
    this.onCloseCallback = onClose;
    this.templateData = {
      defaults: {
        alias: data.alias ?? "",
        modifier: data.modifier ?? 0,
        whisperToGms: data.whisperToGms ?? false
      },
      isAttack: false,
      rollModes: CONST.DICE_ROLL_MODES //TODO: figure out where foundry stores its own localisation strings...
    };
  }

  onSubmitCallback: (data: never) => void;

  onCloseCallback: (reason: string) => void;

  templateData: RollPromptTemplateData;

  override async close(
    options: CloseOptions = { runCallback: true }
  ): Promise<void> {
    if (options?.runCallback) this.onCloseCallback("closed");
    await super.close();
  }

  override getData(): RollPromptTemplateData {
    return this.templateData;
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html.on("submit", this.onSubmit.bind(this));
    html.find("input")[0]?.select();
  }

  /**
   * Handle the submit event of the application input.
   * @param event - the submit event of the form
   */
  protected async onSubmit(event: SubmitEvent): Promise<void> {
    event.preventDefault();

    const data = new FormData(event.target);

    await this.close({ runCallback: false });
    this._onSubmitCallback(this.transformFormData(data));
  }

  protected extractCheckboxValue(key: string, formData: FormData): boolean {
    const inputValue = formData.get(key);
    return inputValue === "on";
  }

  protected extractNumberValue(
    key: string,
    formData: FormData,
    defaultVal?: number
  ): number {
    const inputValue = formData.get(key);

    if (typeof inputValue !== "string") {
      if (defaultVal === undefined)
        throw Error(`The value of input ${String(key)} is missing.`);
      else return defaultVal;
    }

    const value = parseInt(inputValue);
    if (isNaN(value))
      throw Error(`The input of ${String(key)} was not a number.`);
    return value;
  }

  protected extractStringValue(key: string, formData: FormData): string {
    const inputValue = formData.get(key);
    if (typeof inputValue !== "string")
      throw Error(`The value of input ${String(key)} is missing.`);

    return inputValue;
  }

  protected extractRollModeValue(
    key: string,
    formData: FormData
  ): ValueOf<typeof CONST.DICE_ROLL_MODES> {
    const inputValue = formData.get(key);
    if (typeof inputValue !== "string")
      throw Error(`The value of input ${key} is missing.`);

    if (!(inputValue in CONST.DICE_ROLL_MODES))
      throw Error(`Invalid value for roll mode: ${inputValue}`);

    return inputValue as DICE_ROLL_MODES;
  }

  protected transformFormData(formData: FormData): PromptDataCommon {
    const common: PromptDataCommon = {
      alias: this.extractStringValue("alias", formData),
      modifier: this.extractNumberValue("modifier", formData),
      whisperToGms: this.extractCheckboxValue("whisperToGms", formData),
      rollMode: this.extractRollModeValue("rollMode", formData)
    };

    return common;
  }

  protected abstract _onSubmitCallback(data: PromptDataCommon): void;
}

export class CheckPrompt extends RollPrompt {
  static async get(
    data: CheckPromptConstructorData,
    options?: Partial<ApplicationOptions>
  ): Promise<ExternalCheckData> {
    return new Promise((resolve, reject) => {
      new this((data) => resolve(data), reject, data, options);
    });
  }

  /**
   * @param onSubmit - the callback to be executed once the user submits the
   *                   application's form
   * @param onClose - the callback to be executed once the prompt is closed
   *                  without being submitted
   * @param options - the options for the prompt
   */
  constructor(
    onSubmit: (data: ExternalCheckData) => void,
    onClose: () => void,
    data: CheckPromptConstructorData,
    options?: Partial<ApplicationOptions>
  ) {
    super(onSubmit, onClose, data, options);

    this.onSubmitCallback = onSubmit;
  }

  override onSubmitCallback: (data: ExternalCheckData) => void;

  protected override _onSubmitCallback(data: ExternalCheckData): void {
    this.onSubmitCallback(data);
  }
}

export class AttackPrompt extends RollPrompt {
  static async get(
    data: AttackPromptConstructorData,
    options?: Partial<ApplicationOptions>
  ): Promise<AttackPromptData> {
    return new Promise((resolve, reject) => {
      new this((data) => resolve(data), reject, data, options);
    });
  }

  /**
   * @param onSubmit - the callback to be executed once the user submits the
   *                   application's form
   * @param onClose - the callback to be executed once the prompt is closed
   *                  without being submitted
   * @param options - the options for the prompt
   */
  constructor(
    onSubmit: (data: AttackPromptData) => void,
    onClose: () => void,
    data: AttackPromptConstructorData,
    options?: Partial<ApplicationOptions>
  ) {
    super(onSubmit, onClose, data, options);

    this.onSubmitCallback = onSubmit;
    this.templateData = {
      ...super.templateData,
      defaults: {
        ...super.templateData.defaults,
        range: data.range
      }
    };
  }

  override onSubmitCallback: (data: AttackPromptData) => void;

  override templateData: AttackPromptTemplateData;

  protected override transformFormData(formData: FormData): AttackPromptData {
    const common = super.transformFormData(formData);
    return {
      ...common,
      range: this.extractNumberValue("range", formData)
    };
  }

  protected override _onSubmitCallback(data: AttackPromptData): void {
    this.onSubmitCallback(data);
  }
}

// TODO: complete this
export class StringPrompt extends Application {
  static async get(
    label: string,
    options?: Partial<ApplicationOptions>
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      new this((data: string) => resolve(data), reject, options).render(true);
    });
  }

  constructor(
    onSubmit: (data: string) => void,
    onClose: () => void,
    options?: Partial<ApplicationOptions>
  ) {
    super(options);
  }
}
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

/** User-provided data for rolls */
export interface PromptDataCommon {
  /** An alias for the rolling actor */
  alias: string;
  /** An optional modifier for the roll */
  modifier: number;
  /** Whether or not to whisper to GMs */
  whisperToGms: boolean;
  /** The roll mode used */
  rollMode: DICE_ROLL_MODES;
}

export type AttackPromptData = PromptDataCommon & {
  /** The range to the target in metres */
  range: number;
};

export type ExternalCheckData = PromptDataCommon;

export type RollPromptTemplateData = {
  defaults: {
    alias: string;
    modifier: number;
    whisperToGms: boolean;
  };
  isAttack: boolean;
  rollModes: typeof CONST.DICE_ROLL_MODES;
};

export type AttackPromptTemplateData = RollPromptTemplateData & {
  defaults: {
    range: number;
  };
};

type RollPromptConstructorData = {
  alias?: string | null;
  modifier?: number;
  whisperToGms?: boolean;
};

type CheckPromptConstructorData = RollPromptConstructorData;

type AttackPromptConstructorData = RollPromptConstructorData & {
  range: number;
};
