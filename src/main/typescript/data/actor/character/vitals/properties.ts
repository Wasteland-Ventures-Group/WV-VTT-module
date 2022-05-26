import { CompositeNumber, CompositeResource } from "../../../common.js";
import VitalsSource from "./source.js";

export default class VitalsProperties extends VitalsSource {
  constructor(source: VitalsSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.hitPoints = CompositeResource.from(source.hitPoints);
    this.actionPoints = CompositeResource.from(source.actionPoints);
    this.insanity = CompositeResource.from(source.insanity);
    this.strain = CompositeResource.from(source.strain);
  }

  override hitPoints: CompositeResource;

  override actionPoints: CompositeResource;

  override insanity: CompositeResource;

  override strain: CompositeResource;

  /** The healing rate of the character per 8 hours of rest */
  healingRate = new CompositeNumber();
}
