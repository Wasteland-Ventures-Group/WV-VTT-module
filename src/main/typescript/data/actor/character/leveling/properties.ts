import type { LevelingSource } from "./source.js";

export type LevelingProperties = LevelingSource;
export const LevelingProperties = {
  /** The current level of the character */
  level(lev: LevelingProperties): number {
    return Math.floor((1 + Math.sqrt(lev.experience / 12.5 + 1)) / 2);
  },

  /** The maximum skill points of the character */
  maxSkillPoints(lev: LevelingProperties): number {
    return lev.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  },

  totalSpecialPoints(lev: LevelingProperties): number {
    return Object.values(lev.specialPoints).reduce(
      (total, points) => total + points,
      0
    );
  },

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  xpForNextLevel(lev: LevelingProperties): number {
    return 50 * (this.level(lev) + 1) * this.level(lev);
  }
};
