import { ApparelSlot, ApparelSlots, ApparelType } from "../../../constants.js";
import type WvItem from "../../../item/wvItem.js";
import { CompositeNumber } from "../../common.js";
import { PhysicalItemProperties } from "../common/physicalItem/properties.js";
import type ApparelDataSource from "./source.js";
import type { ApparelDataSourceData } from "./source.js";

export default interface ApparelDataProperties extends ApparelDataSource {
  data: ApparelDataPropertiesData;
}

export type ApparelDataPropertiesData = ApparelDataSourceData &
  PhysicalItemProperties & {
    blockedSlots: Record<ApparelSlot, boolean>;

    damageThreshold: CompositeNumber;

    quickSlots: CompositeNumber;

    modSlots: CompositeNumber;

    type: ApparelType;

    slot: ApparelSlot;
  };

export const ApparelDataPropertiesData = {
  from(
    source: ApparelDataSourceData,
    owningItem: WvItem
  ): ApparelDataPropertiesData {
    const baseProperties = PhysicalItemProperties.from(source, owningItem);

    const blockedSlots = ApparelSlots.reduce((acc, slot) => {
      acc[slot] = source.blockedSlots?.[slot] ?? false;
      return acc;
    }, {} as Record<ApparelSlot, boolean>);

    const damageThreshold = CompositeNumber.from(
      source.damageThreshold ?? { source: 0 }
    );

    damageThreshold.bounds.min = 0;

    const quickSlots = CompositeNumber.from(source.quickSlots ?? { source: 0 });
    quickSlots.bounds.min = 0;

    const modSlots = CompositeNumber.from(source.modSlots ?? { source: 0 });
    modSlots.bounds.min = 0;
    return {
      ...source,
      ...baseProperties,
      blockedSlots,
      quickSlots,
      modSlots,
      damageThreshold
    };
  }
};
