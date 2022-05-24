import { CompositeNumber, CompositeResource } from "../../../common.js";
import EquipmentSource from "./source.js";

export default class EquipmentProperties extends EquipmentSource {
  constructor(source: EquipmentSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.quickSlots = CompositeResource.from(source.quickSlots);
  }

  override quickSlots: CompositeResource;

  /** The damage threshold of the character */
  damageThreshold = new CompositeNumber();
}
