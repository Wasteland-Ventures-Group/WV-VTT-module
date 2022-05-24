import { CompositeNumber } from "../../../common.js";
import { Resource } from "../../../foundryCommon.js";
import EquipmentSource from "./source.js";

export default class EquipmentProperties extends EquipmentSource {
  constructor(source: EquipmentSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.quickSlots = Resource.from(source.quickSlots);
  }

  override quickSlots: Resource;

  /** The damage threshold of the character */
  damageThreshold = new CompositeNumber();
}
