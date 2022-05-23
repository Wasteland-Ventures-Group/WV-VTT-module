import LevelingSource from "./source.js";

export default class LevelingProperties extends LevelingSource {
  constructor(source: LevelingSource) {
    super();
    foundry.utils.mergeObject(this, source);
  }

  /** The current level of the character */
  level = 0;

  /** The maximum skill points of the character */
  maxSkillPoints = 0;

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  xpForNextLevel = 0;
}
