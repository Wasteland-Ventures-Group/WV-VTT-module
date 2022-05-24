import { CompositeNumber } from "../../../common.js";
import { Resource } from "../../../foundryCommon.js";
import VitalsSource from "./source.js";

export default class VitalsProperties extends VitalsSource {
  constructor(source: VitalsSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.hitPoints = Resource.from(source.hitPoints);
    this.actionPoints = Resource.from(source.actionPoints);
    this.insanity = Resource.from(source.insanity);
    this.strain = Resource.from(source.strain);
  }

  override hitPoints: Resource;

  override actionPoints: Resource;

  override insanity: Resource;

  override strain: Resource;

  /** The healing rate of the character per 8 hours of rest */
  healingRate = new CompositeNumber();
}
