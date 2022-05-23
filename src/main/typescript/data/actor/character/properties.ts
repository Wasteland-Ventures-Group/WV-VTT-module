import type { TYPES } from "../../../constants.js";
import { CompositeNumber } from "../../common.js";
import BackgroundProperties from "./background/properties.js";
import EquipmentProperties from "./equipment/properties.js";
import LevelingProperties from "./leveling/properties.js";
import SkillsProperties from "./skills/properties.js";
import { CharacterDataSourceData } from "./source.js";
import SpecialsProperties from "./specials/properties.js";
import VitalsProperties from "./vitals/properties.js";

export default interface CharacterDataProperties {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: CharacterDataPropertiesData;
}

export class ResistancesProperties {
  /** The poison resistance of the character */
  poison = new CompositeNumber(10);

  /** The radiation resistance of the character */
  radiation = new CompositeNumber(5);
}

export class CriticalsProperties {
  /** The critical failure chance of the character */
  failure = new CompositeNumber(100);

  /** The critical success chance of the character */
  success = new CompositeNumber(1);
}

export class SecondaryStatisticsProperties {
  /** The criticals of the character */
  criticals = new CriticalsProperties();

  /** The maximum carry weight of the character in kg */
  maxCarryWeight = new CompositeNumber();
}

export class CharacterDataPropertiesData extends CharacterDataSourceData {
  constructor(source: CharacterDataSourceData) {
    super();
    foundry.utils.mergeObject(this, source);
    this.background = new BackgroundProperties(source.background);
    this.equipment = new EquipmentProperties(source.equipment);
    this.leveling = new LevelingProperties(source.leveling);
    this.vitals = new VitalsProperties(source.vitals);
  }

  override background: BackgroundProperties;

  override equipment: EquipmentProperties;

  override leveling: LevelingProperties;

  override vitals: VitalsProperties;

  /** The secondary statistics of the character */
  secondary = new SecondaryStatisticsProperties();

  /** The resistances of the character */
  resistances = new ResistancesProperties();

  /** The skills of the character */
  skills = new SkillsProperties();

  /** The SPECIALs of the character */
  specials = new SpecialsProperties();
}
