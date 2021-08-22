import { CONSTANTS, HANDLEBARS } from "../../constants.js";
import type { RuleElementSource } from "../../ruleEngine/ruleElement.js";
import WrongTypeWarning from "../../ruleEngine/warnings/wrongTypeWarning.js";

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
            warnings: rule.warnings.map((warning) => {
              return warning instanceof WrongTypeWarning
                ? ({
                    messageKey: warning.messageKey,
                    changeMessageKey: warning.changeMessageKey,
                    changeValue: warning.changeValue
                  } as SheetDataWarning)
                : ({ messageKey: warning.messageKey } as SheetDataWarning);
            }),
            hasErrors: rule.hasErrors(),
            hasWarnings: rule.hasWarnings(),
            isNew: rule.isNew(),
            source: rule.source
          } as SheetDataRuleElement;
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
  warnings?: SheetDataWarning[];
  hasErrors?: boolean;
  hasWarnings?: boolean;
  isNew?: boolean;
  source?: RuleElementSource;
}

export interface SheetDataWarning {
  changeMessage?: string;
  changeValue?: string | boolean | number;
  warningMessage?: string;
}
