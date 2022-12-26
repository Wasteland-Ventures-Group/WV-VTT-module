import type { DefinedError } from "ajv";
import type WvActor from "../../actor/wvActor.js";
import { CONSTANTS, HANDLEBARS, Rarities, Rarity } from "../../constants.js";
import { getGame } from "../../foundryHelpers.js";
import type WvItem from "../../item/wvItem.js";
import type { DocumentRelation } from "../../item/wvItem.js";
import AdditionalPropMessage from "../../ruleEngine/messages/additionalPropMessage.js";
import MissingPropMessage from "../../ruleEngine/messages/missingPropMessage.js";
import NotSavedMessage from "../../ruleEngine/messages/notSavedMessage.js";
import SyntaxErrorMessage from "../../ruleEngine/messages/syntaxErrorMessage.js";
import WrongTypeMessage from "../../ruleEngine/messages/wrongTypeMessage.js";
import RuleElement, * as re from "../../ruleEngine/ruleElement.js";
import RuleElementMessage from "../../ruleEngine/ruleElementMessage.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElementSource.js";
import { RULE_ELEMENT_JSON_SCHEMA } from "../../ruleEngine/ruleElementSource.js";
import { LOG } from "../../systemLogger.js";
import WvI18n from "../../wvI18n.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    const defaultOptions = super.defaultOptions;
    defaultOptions.classes.push(
      ...[CONSTANTS.systemId, "document-sheet", "item-sheet"]
    );
    defaultOptions.height = 410;
    defaultOptions.tabs = [
      { navSelector: ".tabs", contentSelector: ".content", initial: "stats" }
    ];
    defaultOptions.width = 600;
    return defaultOptions;
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
    const root = `${CONSTANTS.systemPath}/handlebars/items/`;
    switch (this.item.data.type) {
      case "ammo":
        return root + "ammoSheet.hbs";
      case "apparel":
        return root + "apparelSheet.hbs";
      case "effect":
        return root + "effectSheet.hbs";
      case "magic":
        return root + "magicSheet.hbs";
      case "race":
        return root + "raceSheet.hbs";
      case "weapon":
        return root + "weaponSheet.hbs";
      default:
        return root + "itemSheet.hbs";
    }
  }

  override async getData(): Promise<SheetData> {
    const data = await super.getData();

    let rarity: SheetDataRarity | undefined = undefined;
    if ("rarity" in data.data.data) {
      const i18nRarities = WvI18n.rarities;
      rarity = {
        selectedName: i18nRarities[data.data.data.rarity],
        rarities: Rarities.reduce((rarities, rarityName) => {
          rarities[rarityName] = i18nRarities[rarityName];
          return rarities;
        }, {} as Record<Rarity, string>)
      };
    }

    return {
      ...data,
      sheet: {
        rarity,
        parts: {
          baseItemInputs: HANDLEBARS.partPaths.item.baseItemInputs,
          header: HANDLEBARS.partPaths.item.header,
          physicalItemInputs: HANDLEBARS.partPaths.item.physicalItemInputs,
          rules: HANDLEBARS.partPaths.item.rules
        },
        rules: {
          elements: this.item.data.data.rules.elements.map(
            this.mapSheetDataRuleElement.bind(this)
          )
        },
        systemGridUnit: getGame().system.data.gridUnits
      }
    };
  }

  override activateListeners(html: JQuery<HTMLFormElement>): void {
    super.activateListeners(html);

    const sheetForm = html[0];
    if (!(sheetForm instanceof HTMLFormElement))
      throw new Error("The element passed was not a form element.");

    sheetForm
      .querySelectorAll(".rule-element-control[data-action=create]")
      .forEach((element) =>
        element.addEventListener(
          "click",
          this.onClickCreateRuleElement.bind(this)
        )
      );

    sheetForm
      .querySelectorAll(".rule-element-control[data-action=delete]")
      .forEach((element) =>
        element.addEventListener("click", (event) => {
          if (!(event instanceof MouseEvent))
            throw new Error("This should not happen.");
          this.onClickDeleteRuleElement(event);
        })
      );

    if (this.item.hasEnabledCompendiumLink)
      this.disableCompendiumLinkInputs(sheetForm);
  }

  /** Handle a click event on a create rule element button. */
  protected onClickCreateRuleElement(): void {
    const sources = this.item.data.data.rules.sources;
    sources.push(this.getDefaultRuleElementSource());
    this.item.updateRuleSources(sources);
    LOG.debug(`Created RuleElement on item with id [${this.item.id}]`);
  }

  /** Get the default rule element source for newly created rule elements. */
  protected getDefaultRuleElementSource(): RuleElementSource {
    return { ...RULE_ELEMENT_JSON_SCHEMA.default };
  }

  /** Handle a click event on a delete rule element button. */
  protected onClickDeleteRuleElement(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const ruleElementElement = event.target.closest(".rule-element");
    if (!(ruleElementElement instanceof HTMLElement))
      throw new Error("The rule element element was not an HTMLElement.");

    const index = parseInt(ruleElementElement.dataset.index ?? "");
    if (isNaN(index)) throw new Error("The index was not a number.");

    const sources = this.item.data.data.rules.sources;
    sources.splice(index, 1);
    this.ruleElementSyntaxErrors.splice(index, 1);
    this.ruleElementSchemaErrors.splice(index, 1);
    this.item.updateRuleSources(sources);
    LOG.debug(`Deleted RuleElement on item with id [${this.item.id}]`);
  }

  /** Disable all inputs that would be overwritten by a compendium update. */
  protected disableCompendiumLinkInputs(form: HTMLFormElement): void {
    const disableAmount = !!this.item.getFlag(
      CONSTANTS.systemId,
      "overwriteAmountWithCompendium"
    );
    const disableNotes = !!this.item.getFlag(
      CONSTANTS.systemId,
      "overwriteNotesWithCompendium"
    );
    const disableRules = !!this.item.getFlag(
      CONSTANTS.systemId,
      "overwriteRulesWithCompendium"
    );

    if (disableRules) {
      form
        .querySelectorAll("button.rule-element-control")
        .forEach((element) => element.setAttribute("disabled", ""));
    }

    const tags = ["input", "select", "textarea"];
    for (const tag of tags) {
      const elements = form.getElementsByTagName(tag);
      for (let i = 0; i < elements.length; i++) {
        const el = elements.item(i);
        if (
          el instanceof HTMLInputElement ||
          el instanceof HTMLSelectElement ||
          el instanceof HTMLTextAreaElement
        ) {
          if (!el.name.startsWith("data.") && !el.name.startsWith("sheet."))
            continue;

          if (el.name === "data.amount" && !disableAmount) continue;
          if (el.name === "data.notes" && !disableNotes) continue;
          if (el.name.startsWith("sheet.rules.") && !disableRules) continue;

          el.setAttribute("disabled", "");
        }
      }
    }
  }

  /** Handle a click event on the toggle compendium link button. */
  protected async onClickToggleCompendiumLink(): Promise<void> {
    await this.item.toggleCompendiumLink();
    if (ui.notifications) {
      const key = this.item.getFlag(CONSTANTS.systemId, "disableCompendiumLink")
        ? "wv.system.messages.itemIsNowUnlinked"
        : "wv.system.messages.itemIsNowLinked";
      ui.notifications.info(
        getGame().i18n.format(key, { name: this.item.name })
      );
    }
  }

  /** Handle a click event on the update from compendium button. */
  protected onClickUpdateFromCompendium(): void {
    new Dialog({
      title: getGame().i18n.format(
        "wv.system.dialogs.compendiumOverwriteConfirm.title",
        { name: this.item.name }
      ),
      content: getGame().i18n.localize(
        "wv.system.dialogs.compendiumOverwriteConfirm.content"
      ),
      default: "yes",
      buttons: {
        yes: {
          label: getGame().i18n.localize("wv.system.actions.update"),
          callback: () => this.item.updateFromCompendium()
        },
        no: {
          label: getGame().i18n.localize("wv.system.actions.cancel")
        }
      }
    }).render(true);
  }

  protected override _getHeaderButtons(): Application.HeaderButton[] {
    const buttons = super._getHeaderButtons();
    if (this.item.hasCompendiumLink && this.item.isProtoItemType) {
      buttons.unshift({
        label: getGame().i18n.localize("wv.system.misc.updateFromCompendium"),
        class: "wv-update-from-compendium",
        icon: "fas fa-file-download",
        onclick: this.onClickUpdateFromCompendium.bind(this)
      });
      buttons.unshift({
        label: getGame().i18n.localize("wv.system.misc.toggleCompendiumLink"),
        class: "wv-toggle-compendium-link",
        icon: "fas fa-link",
        onclick: this.onClickToggleCompendiumLink.bind(this)
      });
    }
    return buttons;
  }

  protected override async _updateObject(
    event: Event,
    formData: Record<string, unknown>
  ): Promise<unknown> {
    this.sanitizeTags(formData, "data.tags");
    this.parseRuleElementSources(formData);
    return super._updateObject(event, formData);
  }

  /** Sanitize the tags on the given property in the form data. */
  protected sanitizeTags(
    formData: Record<string, unknown>,
    name: string
  ): void {
    const value = formData[name];
    if (typeof value === "string") {
      formData[name] = [
        ...new Set(
          value
            .split(",")
            .map((string) => string.trim())
            .filter((string) => string.length > 0)
        )
      ].sort((a, b) => a.localeCompare(b));
    }
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
    let documentMessages: SheetDataDocumentMessages[] = [];
    if (hasSyntaxError) {
      messages = [syntaxError, new NotSavedMessage()];
      source = syntaxErrorTuple[1] ?? "";
    } else if (hasSchemaErrors) {
      messages = [...schemaErrors, new NotSavedMessage()];
      source = JSON.stringify(schemaErrorTuple[1] ?? "", null, 2);
    } else {
      messages = rule.messages;
      source = JSON.stringify(rule.source, null, 2);
      documentMessages = [...rule.documentMessages.entries()].map(
        ([document, value]) =>
          this.mapToSheetDataDocumentMessages(document, value)
      );
    }

    return {
      hasDocumentMessages: rule.hasDocumentMessages,
      hasErrors: re.hasErrors(messages) || rule.hasDocumentErrors,
      hasSelectedDocuments: rule.hasSelectedDocuments,
      hasWarnings: re.hasWarnings(messages) || rule.hasDocumentWarnings,
      documentMessages,
      label: rule.label,
      messages,
      selectedDocuments: [...rule.selectedDocuments.entries()].map(
        ([document, value]) =>
          this.mapToSheetDataSelectedDocument(document, value)
      ),
      source
    };
  }

  /**
   * Map an entry in a RuleElement's documentMessages to a
   * SheetDataDocumentMessages.
   */
  private mapToSheetDataDocumentMessages(
    document: WvActor | WvItem,
    value: re.DocumentMessagesValue
  ): SheetDataDocumentMessages {
    return {
      docId: document.id ?? "",
      docName: document.name ?? "",
      messages: value.messages,
      docRelation: getGame().i18n.localize(
        `wv.system.ruleEngine.documentMessages.relations.${value.causeDocRelation}`
      )
    };
  }

  private mapToSheetDataSelectedDocument(
    document: WvActor | WvItem,
    { relation }: { relation: DocumentRelation }
  ): SheetDataSelectedDocument {
    return {
      docId: document.id ?? "",
      docName: document.name ?? "",
      docRelation: getGame().i18n.localize(
        `wv.system.ruleEngine.documentMessages.relations.${relation}`
      )
    };
  }

  /**
   * Parse the RuleElement sources from the form data. This adds the update data
   * for the rule elements to the given form data and deletes the front-end only
   * form data entries. If there are errors, they are added to the corresponding
   * arrays of this class and their updates are not added to the update data.
   * @param formData - the data of the submitted form
   */
  private parseRuleElementSources(formData: Record<string, unknown>) {
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
      if (!Object.keys(formData).keys.length) this.render();
      return;
    }

    // If there are some updates to be saved, fill the empty slots resulting
    // from errors with the same data that's currently saved in the backend
    const originalSources = this.item.data.data.rules.sources;
    for (let index = 0; index < originalSources.length; index += 1) {
      if (ruleSources[index] === undefined) {
        const originalSource = originalSources[index];
        if (originalSource === undefined)
          throw new Error("An original rule element source was undefined.");

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
      new SyntaxErrorMessage(error.message),
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
    ruleSource: object
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
          case "#/properties/hook/enum":
            return new RuleElementMessage(
              "wv.system.ruleEngine.errors.semantic.unknownHook",
              "error"
            );
          case "#/properties/selector/enum":
            return new RuleElementMessage(
              "wv.system.ruleEngine.errors.semantic.unknownSelector",
              "error"
            );
          case "#/properties/type/enum":
            return new RuleElementMessage(
              "wv.system.ruleEngine.errors.semantic.unknownRuleElement",
              "error"
            );
          case "#/properties/conditions/items/enum":
            return new RuleElementMessage(
              "wv.system.ruleEngine.errors.semantic.unknownCondition",
              "error"
            );
        }
    }

    console.dir(error);
    return new RuleElementMessage(
      "wv.system.ruleEngine.errors.semantic.unknown"
    );
  }
}

export interface SheetData extends ItemSheet.Data {
  sheet: {
    rarity: SheetDataRarity | undefined;
    parts: {
      baseItemInputs: string;
      header: string;
      physicalItemInputs: string;
      rules: string;
    };
    rules: {
      elements: SheetDataRuleElement[];
    };
    systemGridUnit: string | undefined;
  };
}

export interface SheetDataRarity {
  selectedName: string;
  rarities: Record<Rarity, string>;
}

export interface SheetDataRuleElement {
  hasDocumentMessages: boolean;
  hasErrors: boolean;
  hasSelectedDocuments: boolean;
  hasWarnings: boolean;
  documentMessages: SheetDataDocumentMessages[];
  label: string;
  messages: SheetDataMessage[];
  selectedDocuments: SheetDataSelectedDocument[];
  source: string;
}

export interface SheetDataDocumentMessages extends SheetDataSelectedDocument {
  messages: SheetDataMessage[];
}

export interface SheetDataSelectedDocument {
  docId: string;
  docName: string;
  docRelation: string;
}

export interface SheetDataMessage {
  cssClass: string;
  iconClass: string;
  message: string;
}
