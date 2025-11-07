import type { DefinedError } from "ajv";
import type WvActor from "../../actor/wvActor.js";
import { CONSTANTS, HANDLEBARS, ProtoItemTypes, Rarities, type ProtoItemType, type Rarity } from "../../constants.js";
import { getGame, } from "../../foundryHelpers.js";
import type WvItem from "../../item/wvItem.js";
import type { DocumentRelation } from "../../item/wvItem.js";
import AdditionalPropMessage from "../../ruleEngine/messages/additionalPropMessage.js";
import MissingPropMessage from "../../ruleEngine/messages/missingPropMessage.js";
import NotSavedMessage from "../../ruleEngine/messages/notSavedMessage.js";
import SyntaxErrorMessage from "../../ruleEngine/messages/syntaxErrorMessage.js";
import WrongTypeMessage from "../../ruleEngine/messages/wrongTypeMessage.js";
import RuleElement, * as re from "../../ruleEngine/ruleElement.js";
import RuleElementMessage from "../../ruleEngine/ruleElementMessage.js";
import { type RuleElementSource } from "../../ruleEngine/ruleElementSource.js";
import { defaultRuleElement, validateRuleElement } from "../../ruleEngine/ruleElementSource.js";
import { LOG } from "../../systemLogger.js";
import WvI18n, { getI18n } from "../../wvI18n.js";

import HandlebarsApplicationMixin = foundry.applications.api.HandlebarsApplicationMixin;
import ItemSheetV2 = foundry.applications.sheets.ItemSheetV2;
import _ = foundry.applications.api.DocumentSheetV2;
import ApplicationV2 = foundry.applications.api.ApplicationV2;
import type { DeepPartial } from "fvtt-types/utils";

export default class WvItemSheet extends HandlebarsApplicationMixin(ItemSheetV2<SheetContext, ItemSheetV2.Configuration, ItemSheetV2.RenderOptions>) {
  static override DEFAULT_OPTIONS = {
    classes: ["document-sheet", "item-sheet"],
    position: { height: 410, width: 600 },
    actions: {
      create: WvItemSheet2.createRuleElement,
      updateFromCompendium: WvItemSheet2.updateFromCompendium,
      toggleCompendiumlink: WvItemSheet2.toggleCompendiumLink,
    },
    window: {
      controls: [
        {
          action: "updateFromCompendium",
          class: "wv-update-from-compendium",
          icon: "fas fa-file-download",
          label: "wv.system.misc.updateFromCompendium",
        },
        {
          class: "wv-toggle-compendium-link",
          icon: "fas fa-link",
          action: "toggleCompendiumLink",
          label: "wv.system.misc.toggleCompendiumLink",
        }
      ]
    }
  };

  static override PARTS = ProtoItemTypes.reduce((a, b) => {
    a[b] = { template: templateByType(b) };
    return a
  }, {} as Record<ProtoItemType, HandlebarsApplicationMixin.HandlebarsTemplatePart>)

  static override TABS: Record<string, ApplicationV2.TabsConfiguration> = {
    "item": {
      initial: "stats",
      tabs: []
    }
  }

  /** Handle a click event on a create rule element button. */
  protected static createRuleElement(): void {
    const self: WvItemSheet2 = this as unknown as WvItemSheet2;
    const sources = self.item.system.rules.sources;
    sources.push(defaultRuleElement());
    self.item.updateRuleSources(sources);
    LOG.debug(`Created RuleElement on item with id [${self.item.id}]`);
  }

  /** Handle a click event on a delete rule element button. */
  protected deleteRuleElement(event: MouseEvent): void {
    if (!(event.target instanceof HTMLElement))
      throw new Error("The target was not an HTMLElement.");

    const ruleElementElement = event.target.closest(".rule-element");
    if (!(ruleElementElement instanceof HTMLElement))
      throw new Error("The rule element element was not an HTMLElement.");

    const index = parseInt(ruleElementElement.dataset["index"] ?? "");
    if (isNaN(index)) throw new Error("The index was not a number.");

    const sources = this.item.system.rules.sources;
    sources.splice(index, 1);
    this.ruleElementSyntaxErrors.splice(index, 1);
    this.ruleElementSchemaErrors.splice(index, 1);
    this.item.updateRuleSources(sources);
    LOG.debug(`Deleted RuleElement on item with id [${this.item.id}]`);
  }

  override _configureRenderOptions(options: ItemSheetV2.RenderOptions) {
    super._configureRenderOptions(options);
    options.parts = [this.item.type];
  }

  override async _prepareContext(options: DeepPartial<ItemSheetV2.RenderOptions> & { isFirstRender: boolean }): Promise<SheetContext> {
    let rarity: SheetDataRarity | undefined = undefined;
    const data = this.item.system;
    if ("rarity" in data) {
      const i18nRarities = WvI18n.rarities;
      rarity = {
        selectedName: i18nRarities[data.rarity as Rarity],
        rarities: Rarities.reduce(
          (rarities, rarityName) => {
            rarities[rarityName] = i18nRarities[rarityName];
            return rarities;
          },
          {} as Record<Rarity, string>
        )
      };
    }
    return {
      ...await super._prepareContext(options),
      system: {
        rarity,
        rules: {
          elements: this.item.system.rules.elements.map(
            this.mapSheetDataRuleElement.bind(this)
          )
        },
        systemGridUnit: getGame().system.gridUnits.toString(),
        parts: {
          baseItemInputs: HANDLEBARS.partPaths.item.baseItemInputs,
          header: HANDLEBARS.partPaths.item.header,
          physicalItemInputs: HANDLEBARS.partPaths.item.physicalItemInputs,
          rules: HANDLEBARS.partPaths.item.rules
        },
      }
    }
  }

  override _prepareSubmitData(event: SubmitEvent, form: HTMLFormElement, formData: FormDataExtended, updateData?: object): object {
    this.sanitizeTags(formData, "data.tags");
    this.parseRuleElementSources(formData);
    return super._prepareSubmitData(event, form, formData, updateData);
  }

  /** Sanitize the tags on the given property in the form data. */
  protected sanitizeTags(
    formData: FormDataExtended,
    name: string
  ): void {
    const value = formData.object[name];
    if (typeof value === "string") {
      formData.object[name] = [
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
   * Parse the RuleElement sources from the form data. This adds the update data
   * for the rule elements to the given form data and deletes the front-end only
   * form data entries. If there are errors, they are added to the corresponding
   * arrays of this class and their updates are not added to the update data.
   * @param formData - the data of the submitted form
   */
  private parseRuleElementSources(formData: FormDataExtended) {
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
          delete formData.object[key];
          continue;
        } else throw error;
      }

      // Validate the source with the rule element schema
      const validationResult = validateRuleElement(ruleSource);
      if (validationResult) {
        this.handleRuleElementSchemaErrors(
          index,
          validationResult.elements as unknown as DefinedError[],
          ruleSource
        );
        delete formData.object[key];
        continue;
      }

      // Assign the source to the corresponding index if successful
      ruleSources[index] = ruleSource as RuleElementSource;
      delete formData.object[key];
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
    const originalSources = this.item.system.rules.sources;
    for (let index = 0; index < originalSources.length; index += 1) {
      if (ruleSources[index] === undefined) {
        const originalSource = originalSources[index];
        if (originalSource === undefined)
          throw new Error("An original rule element source was undefined.");

        ruleSources[index] = originalSource;
      }
    }

    // Add the updates to the appriate entry of the update data
    formData.object["data.rules.sources"] = ruleSources;
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
      docRelation: getI18n().localize(
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
      docRelation: getI18n().localize(
        `wv.system.ruleEngine.documentMessages.relations.${relation}`
      )
    };
  }


  override async _onRender(context: SheetContext, options: ItemSheetV2.RenderOptions): Promise<void> {
    await super._onRender(context, options)

    if (this.item.hasEnabledCompendiumLink)
      this.disableCompendiumLinkInputs();
  }

  /** Disable all inputs that would be overwritten by a compendium update. */
  protected disableCompendiumLinkInputs(): void {
    if (this.form === null) {
      return;
    }
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
      this.form
        .querySelectorAll("button.rule-element-control")
        .forEach((element) => element.setAttribute("disabled", ""));
    }

    const tags = ["input", "select", "textarea"];
    for (const tag of tags) {
      const elements = this.form.getElementsByTagName(tag);
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

  /** Handle a click event on the update from compendium button. */
  protected static updateFromCompendium(): void {
    const self: WvItemSheet2 = this as unknown as WvItemSheet2;
    new Dialog({
      title: getI18n().format(
        "wv.system.dialogs.compendiumOverwriteConfirm.title",
        { name: self.item.name }
      ),
      content: getI18n().localize(
        "wv.system.dialogs.compendiumOverwriteConfirm.content"
      ),
      default: "yes",
      buttons: {
        yes: {
          label: getI18n().localize("wv.system.actions.update"),
          callback: () => self.item.updateFromCompendium()
        },
        no: {
          label: getI18n().localize("wv.system.actions.cancel")
        }
      }
    }).render(true);
  }

  /** Handle a click event on the toggle compendium link button. */
  protected static async toggleCompendiumLink(): Promise<void> {
    const self: WvItemSheet2 = this as unknown as WvItemSheet2;
    await self.item.toggleCompendiumLink();
    if (ui.notifications) {
      const key = self.item.getFlag(CONSTANTS.systemId, "disableCompendiumLink")
        ? "wv.system.messages.itemIsNowUnlinked"
        : "wv.system.messages.itemIsNowLinked";
      ui.notifications.info(
        getI18n().format(key, { name: self.item.name })
      );
    }
  }
}

function templateByType(t: ProtoItemType): string {
  const root = `${CONSTANTS.systemPath}/handlebars/items/`;
  switch (t) {
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

export interface SheetContext extends ItemSheetV2.RenderContext {
  system: {
    rarity: SheetDataRarity | undefined;
    rules: {
      elements: SheetDataRuleElement[];
    };
    systemGridUnit: string | undefined;
    parts: {
      baseItemInputs: string;
      header: string;
      physicalItemInputs: string;
      rules: string;
    };
  }
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
