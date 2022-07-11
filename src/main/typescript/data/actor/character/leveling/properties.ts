import LevelingSource from "./source.js";

export default class LevelingProperties extends LevelingSource {
  constructor(source: LevelingSource) {
    super();
    foundry.utils.mergeObject(this, source);
  }

  /** The current level of the character */
  get level(): number {
    return Math.floor((1 + Math.sqrt(this.experience / 12.5 + 1)) / 2);
  }

  /** The maximum skill points of the character */
  get maxSkillPoints(): number {
    return this.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  get xpForNextLevel(): number {
    return 50 * (this.level + 1) * this.level;
  }
}
