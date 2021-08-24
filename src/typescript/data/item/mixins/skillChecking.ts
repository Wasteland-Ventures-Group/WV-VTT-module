import type { SkillNames } from "../../../constants.js";
import type { AnyConstructor } from "../../../helperTypes.js";

/** A mixin for the SkillChecking interface */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export default function SkillChecking<TBase extends AnyConstructor>(
  Base: TBase
) {
  return class SkillCheckingMixin extends Base implements SkillChecking {
    skill: SkillNames = "firearms";
  };
}

/** This holds base values for items that can cause a skill check. */
export interface SkillChecking {
  /** The skill to be checked against. */
  skill: SkillNames;
}
