import { CONSTANTS, SpecialNames, TYPES } from "../../../constants.js";
import { CompositeNumber } from "../../common.js";
import BackgroundProperties from "../common/background/properties.js";
import EquipmentProperties from "../common/equipment/properties.js";
import LevelingProperties from "./leveling/properties.js";
import MagicProperties from "../common/magic/properties.js";
import SkillsProperties from "./skills/properties.js";
import { CharacterDataSourceData } from "./source.js";
import SpecialsProperties from "../common/specials/properties.js";
import VitalsProperties from "../common/vitals/properties.js";
import SecondaryStatisticsProperties from "../common/secondary/properties.js";

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

export class CharacterDataPropertiesData extends CharacterDataSourceData {
  constructor(source: CharacterDataSourceData) {
    super();
    foundry.utils.mergeObject(this, source);
    this.leveling = new LevelingProperties(source.leveling);

    for (const specialName of SpecialNames) {
      const special = this.specials[specialName];
      special.points = this.leveling.specialPoints[specialName];
      special.permBounds = { min: 0, max: 15 };
      special.tempBounds = { min: 0, max: 15 };
    }

    this.background = new BackgroundProperties(source.background);
    this.equipment = new EquipmentProperties(source.equipment);
    this.vitals = new VitalsProperties(source.vitals);
    this.magic = new MagicProperties(source.magic);
  }

  override background: BackgroundProperties;

  override equipment: EquipmentProperties;

  override leveling: LevelingProperties;

  override vitals: VitalsProperties;

  override magic: MagicProperties;

  /** The secondary statistics of the character */
  secondary = new SecondaryStatisticsProperties();

  /** The resistances of the character */
  resistances = new ResistancesProperties();

  /** The skills of the character */
  skills = new SkillsProperties();

  /** The SPECIALs of the character */
  specials = new SpecialsProperties();
}
