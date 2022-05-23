import { CompositeNumber } from "../../../common.js";
import VitalsSource from "./source.js";

export default class VitalsProperties extends VitalsSource {
  constructor(source: VitalsSource) {
    super();
    foundry.utils.mergeObject(this, source);
  }

  /** The healing rate of the character per 8 hours of rest */
  healingRate = new CompositeNumber();
}
