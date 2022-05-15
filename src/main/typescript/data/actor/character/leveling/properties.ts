import LevelingSource from "./source.js";

/** Derived leveling related data */
export default class Leveling extends LevelingSource {
  /** The current level of an Actor */
  level?: number;

  /** The maximum skill points of an Actor */
  maxSkillPoints?: number;

  /** The amount of experience needed for the next level */
  xpForNextLevel?: number;
}
