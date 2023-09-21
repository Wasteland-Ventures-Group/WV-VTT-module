import type { LevelingSource } from "./source.js";

export type LevelingProperties = LevelingSource & {
  /** The current level of the character */
  readonly level: number;

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  readonly xpForNextLevel: number;

  /** The maximum skill points of the character */
  readonly maxSkillPoints: number;

  /** The total number of special points of the character */
  readonly totalSpecialPoints: number;
};

export const LevelingProperties = {
  from(source: LevelingSource): LevelingProperties {
    return {
      ...source,

      get level() {
        return Math.floor((1 + Math.sqrt(this.experience / 12.5 + 1)) / 2);
      },

      get xpForNextLevel() {
        return 50 * (this.level + 1) * this.level;
      },

      get maxSkillPoints() {
        return this.levelIntelligences.reduce(
          (skillPoints, intelligence) =>
            skillPoints + Math.floor(intelligence / 2) + 10,
          0
        );
      },

      get totalSpecialPoints(): number {
        return Object.values(this.specialPoints).reduce(
          (total, points) => total + points,
          0
        );
      }
    };
  }
};
