import type { TYPES } from "../../../constants.js";
import Equipment from "./equipment/properties.js";
import Leveling from "./leveling/properties.js";
import Skills from "./skills/properties.js";
import { CharacterDataSourceData } from "./source.js";
import Specials from "./specials/properties.js";
import Vitals from "./vitals/properties.js";

/** The character data-properties */
export default interface CharacterDataProperties {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataPropertiesData;
}

/** Derived resistance values */
export class Resistances {
  /** The basic poison resitance of an Actor */
  poison = 10;

  /** The basic radiation resistance of an Actor */
  radiation = 5;
}

/** Stats related to critical success and failure */
export class Criticals {
  /**
   * Create a new Criticals.
   * @param success - the critical success chance
   * @param failure - the critical failure chance
   */
  constructor(success = 1, failure = 100) {
    this.success = success;
    this.failure = failure;
  }

  /** The critical success chance */
  success: number = 1;

  /** The critical failure chance */
  failure: number = 100;
}

/** Derived secondary statistics */
export class SecondaryStatistics {
  /** The criticals of the Actor */
  criticals: Criticals = new Criticals();

  /** The maximum carry weight of an Actor in kg */
  maxCarryWeight?: number;
}

/** The character data-properties data */
export class CharacterDataPropertiesData extends CharacterDataSourceData {
  override vitals: Vitals = new Vitals();

  override leveling: Leveling = new Leveling();

  override equipment: Equipment = new Equipment();

  specials: Specials = new Specials();

  /** The skills of an Actor */
  skills: Skills = new Skills();

  /** The resistances of an Actor */
  resistances: Resistances = new Resistances();

  /** The secondary statistics of an Actor */
  secondary: SecondaryStatistics = new SecondaryStatistics();
}
