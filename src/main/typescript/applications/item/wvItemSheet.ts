import { CONSTANTS, HANDLEBARS } from "../../constants.js";
import { getGame } from "../../foundryHelpers.js";
import type RuleElementSource from "../../ruleEngine/ruleElementSource.js";
import RuleElements from "../../ruleEngine/ruleElements.js";
import { LOG } from "../../systemLogger.js";
import * as re from "../../ruleEngine/ruleElement.js";
import SyntaxErrorMessage from "../../ruleEngine/messages/syntaxErrorMessage.js";
import RuleElementMessage from "../../ruleEngine/ruleElementMessage.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "item-sheet"]
    } as typeof ItemSheet["defaultOptions"]);
  }

  /**
   * A list of rule element source syntax errors, with their indices
   * corresponding to the rule elements.
   */
  protected ruleElementSyntaxErrors: [
    message: SyntaxErrorMessage,
    rawSource: string
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
          elements: data.data.data.rules.elements.map((rule, index) => {
            const syntaxErrorTuple = this.ruleElementSyntaxErrors[index] ?? [];
            const syntaxError = syntaxErrorTuple[0];
            const rawSource = syntaxErrorTuple[1] ?? "";
            const hasSyntaxError = syntaxError instanceof RuleElementMessage;
            const messages = hasSyntaxError ? [syntaxError] : rule.messages;
            const source = hasSyntaxError ? rawSource : rule.source;
            return {
              hasErrors: re.hasErrors(rule),
              hasSyntaxError,
              hasWarnings: re.hasWarnings(rule),
              label:
                rule.source.label ||
                getGame().i18n.localize("wv.ruleEngine.ruleElement.newName"),
              messages,
              source
            };
          })
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

  /**
   * Handle a click event on a create rule element button.
   */
  protected onClickCreateRuleElement(): void {
    const sources = this.item.data.data.rules.sources;
    sources.push(RuleElements.newRuleElementSource());
    this.item.updateRuleSources(sources);
    LOG.debug(`Created RuleElement on item with id [${this.item.id}]`);
    this.item.prepareBaseData();
    this.render(false);
  }

  /**
   * Handle a click event on a delete rule element button.
   */
  protected onClickDeleteRuleElement(event: ClickEvent): void {
    const index = $(event.target).parents(".rule-element").data("index");
    if (typeof index !== "number")
      throw new Error("Could not find the index data!");

    const sources = this.item.data.data.rules.sources;
    sources.splice(index, 1);
    this.item.updateRuleSources(sources);
    LOG.debug(`Deleted RuleElement on item with id [${this.item.id}]`);
    this.item.prepareBaseData();
    this.render(false);
  }

  protected override async _updateObject(
    event: Event,
    formData: Record<string, string | RuleElementSource[] | unknown>
  ): Promise<unknown> {
    try {
      this.parseRuleElementSources(formData);
    } catch (error) {
      if (error instanceof HandledSyntaxErrors) {
        LOG.warn(error.message);
      } else {
        LOG.error(error);
      }
      return;
    }

    return super._updateObject(event, formData);
  }

  /**
   * Parse the RuleElement sources from the form data.
   * @param formData - the data of the submitted form
   * @throws if the JSON parsing of an element source fails
   */
  private parseRuleElementSources(
    formData: Record<string, string | RuleElementSource[] | unknown>
  ) {
    this.ruleElementSyntaxErrors = [];
    const rules: RuleElementSource[] = [];
    Object.entries(formData).forEach(([key, value]) => {
      if (!key.startsWith("sheet.rules.") || typeof value !== "string") return;

      try {
        rules.push(JSON.parse(value));
        delete formData[key];
      } catch (error) {
        if (error instanceof Error) {
          const index = parseInt(key.split(".")[2] ?? "");
          if (isNaN(index)) {
            throw new Error(
              "Could not get the index of a rule element with syntax error"
            );
          }
          this.handleJsonParseError(index, error.message, value);
        }
      }
    });
    if (this.ruleElementSyntaxErrors.length) {
      this.render();
      throw new HandledSyntaxErrors("There were syntax errors.");
    }

    formData["data.rules.sources"] = rules;
  }

  /**
   * Handle a JSON parse error by adding it to the syntax error array.
   * @param index - the index of the rule element source, that caused the error
   * @param message - the error message
   * @param rawSource - the raw source with syntax errors
   */
  private handleJsonParseError(
    index: number,
    message: string,
    rawSource: string
  ) {
    this.ruleElementSyntaxErrors[index] = [
      new SyntaxErrorMessage(message),
      rawSource
    ];
    LOG.warn(`Syntax error in rule element definition ${index + 1}.`, message);
  }
}

/**
 * An error subclass to signal that the item should not be updated, but that
 * rule element syntax errors have been successfully handled.
 */
class HandledSyntaxErrors extends Error {}

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
  messages: SheetDataMessage[];
  hasErrors: boolean;
  hasSyntaxError: boolean;
  hasWarnings: boolean;
  source: string | re.UnknownRuleElementSource;
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
