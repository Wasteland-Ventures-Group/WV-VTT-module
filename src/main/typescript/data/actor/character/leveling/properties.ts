import { type LevelingSource } from "./source.js";

export type LevelingProperties = LevelingSource & {};
export namespace LevelingProperties {
  export function from(l: LevelingSource): LevelingProperties {
    const result = { ...l }

    return result;
  }

  /** The current level of the character */
  export function level(self: LevelingProperties): number {
    return Math.floor((1 + Math.sqrt(self.experience / 12.5 + 1)) / 2);
  }

  /** The maximum skill points of the character */
  export function maxSkillPoints(self: LevelingProperties): number {
    return self.levelIntelligences.reduce(
      (skillPoints, intelligence) =>
        skillPoints + Math.floor(intelligence / 2) + 10,
      0
    );
  }

  export function totalSpecialPoints(self: LevelingProperties): number {
    return Object.values(self.specialPoints).reduce(
      (total, points) => total + points,
      0
    );
  }

  /**
   * The amount of experience needed for the character to advance to the next
   * level
   */
  export function xpForNextLevel(self: LevelingProperties): number {
    const l = level(self);
    return 50 * (l + 1) * l;
  }
}
