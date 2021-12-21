import { CONSTANTS, HANDLEBARS } from "../../constants.js";
import { getGame } from "../../foundryHelpers.js";
import type RuleElementSource from "../../ruleEngine/ruleElementSource.js";
import RuleElements from "../../ruleEngine/ruleElements.js";
import { LOG } from "../../systemLogger.js";
import * as re from "../../ruleEngine/ruleElement.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: [CONSTANTS.systemId, "document-sheet", "item-sheet"]
    } as typeof ItemSheet["defaultOptions"]);
  }

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
          elements: data.data.data.rules.elements.map((rule) => {
            return {
              hasErrors: re.hasErrors(rule),
              hasWarnings: re.hasWarnings(rule),
              label:
                rule.source.label ||
                getGame().i18n.localize("wv.ruleEngine.ruleElement.newName"),
              messages: rule.messages.map((message) => ({
                cssClass: message.cssClass,
                iconClass: message.iconClass,
                message: message.message
              })),
              source: rule.source
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
    const rules: RuleElementSource[] = [];
    Object.entries(formData).forEach(([key, value], index) => {
      if (!key.startsWith("sheet.rules.") || typeof value !== "string") return;

      try {
        rules.push(JSON.parse(value));
        delete formData[key];
      } catch (error) {
        if (error instanceof Error) {
          this.communicateJsonParseError(index, error.message);
        }
        throw error;
      }
    });
    formData["data.rules.sources"] = rules;
  }

  /**
   * Communicate a JSON parse error both via the notification system and the
   * console.
   * @param index - the index of the rule element source, that caused the error
   * @param message - the error message
   */
  private communicateJsonParseError(index: number, message: string) {
    if (ui.notifications) {
      ui.notifications.error(
        getGame().i18n.format("wv.ruleEngine.errors.syntax", {
          message: message,
          number: index
        }),
        { permanent: true }
      );
    }
    LOG.warn(`Syntax error in rule element definition ${index}.`, message);
  }
}

export interface SheetData extends ItemSheet.Data {
  sheet: {
    parts: {
      header: string;
      rules: string;
    };
    rules: {
      elements: SheetDataRuleElement[] | undefined;
    };
  };
}

export interface SheetDataRuleElement {
  messages: SheetDataMessage[];
  hasErrors: boolean;
  hasWarnings: boolean;
  source: re.UnknownRuleElementSource;
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
