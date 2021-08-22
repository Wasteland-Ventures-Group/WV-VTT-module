import type Effect from "../../item/effect.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElement.js";
import { CONSTANTS, TYPES } from "../../constants.js";
import { isOfItemType } from "../../helpers.js";
import WvItemSheet from "./wvItemSheet.js";
import RuleElements from "../../ruleEngine/ruleElements.js";
import { getGame } from "../../foundryHelpers.js";

/** An Item Sheet for Effect items. */
export default class EffectSheet extends WvItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push("effect-sheet");
    return foundry.utils.mergeObject(defaultOptions, {
      height: 500,
      width: 670
    } as typeof ActorSheet["defaultOptions"]);
  }

  override get item(): Effect {
    if (!isOfItemType(super.item, TYPES.ITEM.EFFECT))
      throw "The used Item is not an Effect!";

    return super.item;
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
    if (this.item.data.type !== TYPES.ITEM.EFFECT)
      throw `This Item data's type is not ${TYPES.ITEM.EFFECT}.`;

    const sources = this.item.data.data.rules.sources;
    sources.push(RuleElements.newRuleElementSource());
    this.item.updateRuleSources(sources);
    console.debug(
      `${CONSTANTS.systemName} | Created RuleElement on item with id [${this.item.id}]`
    );
    this.item.prepareBaseData();
    this.render(false);
  }

  /**
   * Handle a click event on a delete rule element button.
   */
  protected onClickDeleteRuleElement(event: ClickEvent): void {
    if (this.item.data.type !== TYPES.ITEM.EFFECT)
      throw `This Item data's type is not ${TYPES.ITEM.EFFECT}.`;

    const index = $(event.target).parents(".rule-element").data("index");
    if (typeof index !== "number") throw "Could not find the index data!";

    const sources = this.item.data.data.rules.sources;
    sources.splice(index, 1);
    this.item.updateRuleSources(sources);
    console.debug(
      `${CONSTANTS.systemName} | Deleted RuleElement on item with id [${this.item.id}]`
    );
    this.item.prepareBaseData();
    this.render(false);
  }

  protected override async _updateObject(
    event: Event,
    formData: Record<string, string | RuleElementSource[] | unknown>
  ): Promise<Effect | undefined> {
    try {
      this.parseRuleElementSources(formData);
    } catch (error) {
      return;
    }

    super._updateObject(event, formData);
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
    console.warn(
      `${CONSTANTS.systemName} | Syntax error in rule element definition ${index}.`,
      message
    );
  }
}

type ClickEvent = JQuery.ClickEvent<
  HTMLElement,
  unknown,
  HTMLElement,
  HTMLElement
>;
