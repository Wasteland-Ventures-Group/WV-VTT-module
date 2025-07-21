import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import RulesProperties from "../common/rules/properties.js";
import StackableItemProperties from "../common/stackableItem/properties.js";
import type AmmoDataSource from "./source.js";
import { AmmoDataSourceData, type AmmoSource } from "./source.js";

export type AmmoProperties = {
  value: CompositeNumber,
} & AmmoSource;

export namespace AmmoProperties {
  export function from(src: AmmoSource): AmmoProperties {
    return { ...src, value: CompositeNumber.from(src.value) }
  }
}

export interface AmmoDataProperties extends AmmoDataSource {
  data: AmmoDataPropertiesData;
}

export class AmmoDataPropertiesData
  extends AmmoDataSourceData
  implements StackableItemProperties {
  constructor(source: AmmoDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    StackableItemProperties.transform(this, source, owningItem);
  }

  rules = new RulesProperties();

  value = new CompositeNumber();

  weight = new CompositeNumber();
}
