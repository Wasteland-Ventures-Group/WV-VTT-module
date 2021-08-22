import { CONSTANTS, HANDLEBARS } from "../../constants.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElement.js";

/** The basic Wasteland Ventures Item Sheet. */
export default class WvItemSheet extends ItemSheet<
  ItemSheet.Options,
  SheetData
> {
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
    data.sheet = {
      parts: {
        header: HANDLEBARS.partPaths.item.header,
        rules: HANDLEBARS.partPaths.item.rules
      },
      rules: {
        elements: data.data.data.rules.elements.map((rule) => {
          return {
            errorKeys: rule.errorKeys,
            hasErrors: rule.hasErrors(),
            isNew: rule.isNew(),
            source: rule.source
          };
        })
      }
    };
    return data;
  }
}

export interface SheetData extends ItemSheet.Data {
  sheet?: {
    parts?: {
      header?: string;
      rules?: string;
    };
    rules?: {
      elements?: SheetDataRuleElement[];
    };
  };
}

export interface SheetDataRuleElement {
  errorKeys?: string[];
  hasErrors?: boolean;
  isNew?: boolean;
  source?: RuleElementSource;
}
