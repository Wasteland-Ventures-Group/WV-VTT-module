import type { DefinedError } from "ajv";
import { CONSTANTS, HANDLEBARS } from "../../constants.js";
import { getGame } from "../../foundryHelpers.js";
import AdditionalPropMessage from "../../ruleEngine/messages/additionalPropMessage.js";
import MissingPropMessage from "../../ruleEngine/messages/missingPropMessage.js";
import NotSavedMessage from "../../ruleEngine/messages/notSavedMessage.js";
import SyntaxErrorMessage from "../../ruleEngine/messages/syntaxErrorMessage.js";
import WrongTypeMessage from "../../ruleEngine/messages/wrongTypeMessage.js";
import RuleElement, * as re from "../../ruleEngine/ruleElement.js";
import RuleElementMessage from "../../ruleEngine/ruleElementMessage.js";
import type RuleElementSource from "../../ruleEngine/ruleElementSource.js";
import { JSON_SCHEMA as RULE_ELEMENT_JSON_SCHEMA } from "../../ruleEngine/ruleElementSource.js";
import { LOG } from "../../systemLogger.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "item-sheet"]
    } as typeof ItemSheet["defaultOptions"]);
  }

  /**
   * A list of rule element syntax error tuples, with their indices
   * corresponding to the rule elements. A tuple contains a syntax error message
   * and the raw string source of the rule element.
   */
  protected ruleElementSyntaxErrors: [
    message: SyntaxErrorMessage,
    rawSource: string
  ][] = [];

  /**
   * A list of rule element schema error tuples, with their indices
   * corresponding to the rule elements. A tuple contains an array of rule
   * element messages and the parsed source object of the rule element.
   */
  protected ruleElementSchemaErrors: [
    messages: RuleElementMessage[],
    source: object
  ][] = [];

  override get template(): string {
    return `${CONSTANTS.systemPath}/handlebars/items/${this.item.data.type}Sheet.hbs`;
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();
    return {
      ...data,
      sheet: {
        parts: {
          header: HANDLEBARS.partPaths.item.header,
          rules: HANDLEBARS.partPaths.item.rules
        },
        rules: {
          elements: data.data.data.rules.elements.map(
            this.mapSheetDataRuleElement.bind(this)
          )
        }
      }
    };
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    html
      .find(".rule-element-control[data-action=create]")
      .on("click", this.onClickCreateRuleElement.bind(this));

    html
      .find(".rule-element-control[data-action=delete]")
      .on("click", this.onClickDeleteRuleElement.bind(this));
  }

  /** Handle a click event on a create rule element button. */
  protected onClickCreateRuleElement(): void {
    const sources = this.item.data.data.rules.sources;
    sources.push(RULE_ELEMENT_JSON_SCHEMA.default);
    this.item.updateRuleSources(sources);
    LOG.debug(`Created RuleElement on item with id [${this.item.id}]`);
    this.item.prepareData();
    this.render(false);
  }

  /** Handle a click event on a delete rule element button. */
  protected onClickDeleteRuleElement(event: ClickEvent): void {
    const index = $(event.target).parents(".rule-element").data("index");
    if (typeof index !== "number")
      throw new Error("Could not find the index data!");

    const sources = this.item.data.data.rules.sources;
    sources.splice(index, 1);
    this.ruleElementSyntaxErrors.splice(index, 1);
    this.ruleElementSchemaErrors.splice(index, 1);
    this.item.updateRuleSources(sources);
    LOG.debug(`Deleted RuleElement on item with id [${this.item.id}]`);
    this.item.prepareData();
    this.render(false);
  }

  protected override async _updateObject(
    event: Event,
    formData: Record<string, string | RuleElementSource[] | unknown>
  ): Promise<unknown> {
    this.parseRuleElementSources(formData);
    return super._updateObject(event, formData);
  }

  /**
   * Map a given, saved rule element to a SheetDataRuleElement. This checks the
   * two error arrays of the application and uses their data, if there is an
   * entry at the corresponding index.
   * @param rule - the original rule, saved in the back-end
   * @param index - the index of the rule in the sources array of the item
   */
  private mapSheetDataRuleElement(
    rule: RuleElement,
    index: number
  ): SheetDataRuleElement {
    const syntaxErrorTuple = this.ruleElementSyntaxErrors[index] ?? [];
    const schemaErrorTuple = this.ruleElementSchemaErrors[index] ?? [];
    const syntaxError = syntaxErrorTuple[0];
    const schemaErrors = schemaErrorTuple[0];

    const hasSyntaxError = syntaxError instanceof RuleElementMessage;
    const hasSchemaErrors = schemaErrors?.length;

    let messages: RuleElementMessage[];
    let source: string;
    if (hasSyntaxError) {
      messages = [syntaxError, new NotSavedMessage()];
      source = syntaxErrorTuple[1] ?? "";
    } else if (hasSchemaErrors) {
      messages = [...schemaErrors, new NotSavedMessage()];
      source = JSON.stringify(schemaErrorTuple[1] ?? "", null, 2);
    } else {
      messages = rule.messages;
      source = JSON.stringify(rule.source, null, 2);
    }

    return {
      hasErrors: re.hasErrors(messages),
      hasWarnings: re.hasWarnings(messages),
      label: rule.source.label,
      messages,
      source
    };
  }

  /**
   * Parse the RuleElement sources from the form data. This adds the update data
   * for the rule elements to the given form data and deletes the front-end only
   * form data entries. If there are errors, they are added to the corresponding
   * arrays of this class and their updates are not added to the update data.
   * @param formData - the data of the submitted form
   */
  private parseRuleElementSources(
    formData: Record<string, string | RuleElementSource[] | unknown>
  ) {
    // Prepare for a new parse
    this.ruleElementSyntaxErrors = [];
    this.ruleElementSchemaErrors = [];
    const ruleSources: RuleElementSource[] = [];

    // Iterate over the relavant form data entries
    for (const [key, value] of Object.entries(formData)) {
      if (!key.startsWith("sheet.rules.") || typeof value !== "string")
        continue;

      const index = this.getRuleElementIndex(key);

      // Try to parse the source
      let ruleSource: object;
      try {
        ruleSource = JSON.parse(value);
      } catch (error) {
        if (error instanceof SyntaxError) {
          this.handleJsonSyntaxError(index, error, value);
          delete formData[key];
          continue;
        } else throw error;
      }

      // Validate the source with the rule element schema
      const validator = getGame().wv.validators.ruleElement;
      if (!validator(ruleSource)) {
        this.handleRuleElementSchemaErrors(
          index,
          validator.errors as DefinedError[],
          ruleSource
        );
        delete formData[key];
        continue;
      }

      // Assign the source to the corresponding index if successful
      ruleSources[index] = ruleSource;
      delete formData[key];
    }

    // If there are no updates that can be saved, don't add the data to the
    // updates, to not delete stuff in the backend
    if (!ruleSources.length) {
      // If the rule elements were the only thing that was changed, but all of
      // them contained errors, preventing save, we need to rerender manually.
      if (!Object.keys(formData).keys.length) this.render(false);
      return;
    }

    // If there are some updates to be saved, fill the empty slots resulting
    // from errors with the same data that's currently saved in the backend
    const originalSources = this.item.data.data.rules.sources;
    for (let index = 0; index < originalSources.length; index += 1) {
      if (ruleSources[index] === undefined) {
        const originalSource = originalSources[index];
        if (originalSource === undefined)
          throw new Error("An original rule element source was undefined!");

        ruleSources[index] = originalSource;
      }
    }

    // Add the updates to the appriate entry of the update data
    formData["data.rules.sources"] = ruleSources;
  }

  /**
   * Get a rule element index out of a given form data key.
   * @param key - the formdata key, should have two "." in it and a number after
   * @throws if no index could be extracted out of the key
   */
  private getRuleElementIndex(key: string): number {
    const index = parseInt(key.split(".")[2] ?? "");
    if (isNaN(index))
      throw new Error("Could not get the index of a rule element.");
    return index;
  }

  /**
   * Handle a JSON syntax error by adding it to the syntax error array.
   * @param index - the index of the rule element source, that caused the error
   * @param error - the syntax error
   * @param rawSource - the raw source with syntax errors
   */
  private handleJsonSyntaxError(
    index: number,
    error: SyntaxError,
    rawSource: string
  ): void {
    this.ruleElementSyntaxErrors[index] = [
      new SyntaxErrorMessage(
        error.message.split(": ")[1] ?? "Unable to get specific message"
      ),
      rawSource
    ];
    LOG.warn(
      `There was a syntax error in rule element definition ${index + 1}.`,
      error.message
    );
  }

  /**
   * Handle rule element schema errors by adding them to the schema error array.
   * @param index - the index of the rule element source, that caused the error
   * @param errors - the schema errors
   * @param ruleSource - the invalid rule element source
   */
  private handleRuleElementSchemaErrors(
    index: number,
    errors: DefinedError[],
    ruleSource: re.UnknownRuleElementSource
  ): void {
    const messages = errors.map(this.translateError);
    this.ruleElementSchemaErrors[index] = [messages, ruleSource];
    LOG.warn(
      `There were schema errors in rule element definition ${index + 1}.`,
      messages
    );
  }

  /** Translate an AJV DefinedError to a RuleElementMessage. */
  private translateError(error: DefinedError): RuleElementMessage {
    switch (error.keyword) {
      case "additionalProperties":
        return new AdditionalPropMessage(
          error.instancePath,
          error.params.additionalProperty
        );
      case "required":
        return new MissingPropMessage(
          error.instancePath,
          error.params.missingProperty
        );

      case "type":
        return new WrongTypeMessage(error.instancePath, error.params.type);

      case "enum":
        switch (error.schemaPath) {
          case "#/properties/target/enum":
            return new RuleElementMessage(
              "wv.ruleEngine.errors.semantic.unknownTarget",
              "error"
            );
          case "#/properties/type/enum":
            return new RuleElementMessage(
              "wv.ruleEngine.errors.semantic.unknownRuleElement",
              "error"
            );
        }
    }

    console.dir(error);
    return new RuleElementMessage("wv.ruleEngine.errors.semantic.unknown");
  }
}

export interface SheetData extends ItemSheet.Data {
  sheet: {
    parts: {
      header: string;
      rules: string;
    };
    rules: {
      elements: SheetDataRuleElement[];
    };
  };
}

export interface SheetDataRuleElement {
  hasErrors: boolean;
  hasWarnings: boolean;
  label: string;
  messages: SheetDataMessage[];
  source: string;
}

export interface SheetDataMessage {
  cssClass: string;
  iconClass: string;
  message: string;
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;
