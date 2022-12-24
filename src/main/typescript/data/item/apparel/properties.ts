import type { ApparelSlot, ApparelType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import PhysicalItemProperties from "../common/physicalItem/properties.js";
import RulesProperties from "../common/rules/properties.js";
import type ApparelDataSource from "./source.js";
import type { ApparelDataSourceData } from "./source.js";

export default interface ApparelDataProperties extends ApparelDataSource {
  data: ApparelDataPropertiesData;
}

export class ApparelDataPropertiesData
  extends PhysicalItemProperties
  implements ApparelDataSourceData
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

    this.damageThreshold = CompositeNumber.from(
      source.damageThreshold ?? { source: 0 }
    );
    this.damageThreshold.bounds.min = 0;

    this.quickSlots = CompositeNumber.from(source.quickSlots ?? { source: 0 });
    this.quickSlots.bounds.min = 0;

    this.modSlots = CompositeNumber.from(source.modSlots ?? { source: 0 });
    this.modSlots.bounds.min = 0;

    this.slot = source.slot;
    this.type = source.type;
  }

  override rules = new RulesProperties();

  override value = new CompositeNumber();

  override weight = new CompositeNumber();

  blockedSlots: Record<ApparelSlot, boolean>;

  damageThreshold: CompositeNumber;

  quickSlots: CompositeNumber;

  modSlots: CompositeNumber;

  type: ApparelType;

  slot: ApparelSlot;
}
