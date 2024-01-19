import type { TYPES } from "../../../constants";
import SpecialsProperties from "../common/specials/properties";
import VitalsProperties from "../common/vitals/properties";
import SkillsProperties from "./skills/properties";
import { NpcDataSourceData } from "./source";

export default interface NpcDataProperties {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: NpcDataPropertiesData;
}

export class NpcDataPropertiesData extends NpcDataSourceData {
  constructor(source: NpcDataSourceData) {
    super();
    foundry.utils.mergeObject(this, source);

    this.specials = SpecialsProperties.from(source.specials);
    this.vitals = new VitalsProperties(source.vitals);
    this.skills = new SkillsProperties(source.skills);
  }

  specials = new SpecialsProperties();

  vitals: VitalsProperties;

  skills: SkillsProperties;
}
