import BaseSkillsProperties from "../../common/skills/properties.js";
import type SkillsSource from "./source.js";

export default class SkillsProperties extends BaseSkillsProperties {
  constructor(source: SkillsSource) {
    super();
    mergeObject(this, source);
  }
}
