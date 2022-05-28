import type { ApparelSlot } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import PhysicalItemProperties from "../common/physicalItem/properties.js";
import RulesProperties from "../common/rules/properties.js";
import type ApparelDataSource from "./source.js";
import { ApparelDataSourceData } from "./source.js";

export default interface ApparelDataProperties extends ApparelDataSource {
  data: ApparelDataPropertiesData;
}

export class ApparelDataPropertiesData
  extends ApparelDataSourceData
  implements PhysicalItemProperties
{
  constructor(source: ApparelDataSourceData, owningItem: WvItem) {
    super();
    foundry.utils.mergeObject(this, source);
    PhysicalItemProperties.transform(this, source, owningItem);
    this.blockedSlots = source.blockedSlots ?? {
      armor: false,
      belt: false,
      clothing: false,
      eyes: false,
      mouth: false
    };
    this.damageThreshold = source.damageThreshold
      ? CompositeNumber.from(source.damageThreshold)
      : new CompositeNumber();
    this.quickSlots = source.quickSlots
      ? CompositeNumber.from(source.quickSlots)
      : new CompositeNumber();
    this.modSlots = source.modSlots
      ? CompositeNumber.from(source.modSlots)
      : new CompositeNumber();
  }

  override rules = new RulesProperties();

  override value = new CompositeNumber();

  override weight = new CompositeNumber();

  override blockedSlots: Record<ApparelSlot, boolean>;

  override damageThreshold: CompositeNumber;

  override quickSlots: CompositeNumber;

  override modSlots: CompositeNumber;
}
