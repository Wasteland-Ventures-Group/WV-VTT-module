import VitalsSource from "./source.js";

/** Derived vitals data */
export default class Vitals extends VitalsSource {
  /** The healing rate of an Actor per 8 hours of rest */
  healingRate?: number;
}
