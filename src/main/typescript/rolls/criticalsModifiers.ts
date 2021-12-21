/**
 * Flag critically failed results which occurred in a given result set.
 * Critical Failures are flagged relative to some target.
 * @param modifier - The matched modifier query
 */
export function flagCriticalFailure(
  this: Die,
  modifier: string
): boolean | void {
  const match = modifier.match(/(?:fcf)([<>=]+)?([0-9]+)?/i);
  if (!match) return false;
  for (const result of this.results) {
    if (
      DiceTerm.compareResult(
        result.result,
        match[1] || ">=",
        parseInt(match[2])
      )
    ) {
      result.critical = "failure";

      if (typeof result.count === "number") {
        result.count = 0;
      }
      if (result.success === true) {
        result.success = false;
      }
      if (result.failure === false) {
        result.failure = true;
      }
    } else if (!result.critical) {
      result.critical = "none";
    }
  }
}

/**
 * Flag critically successful results which occurred in a given result set.
 * Critical Successes are flagged relative to some target.
 * @param modifier - The matched modifier query
 */
export function flagCriticalSuccesses(
  this: Die,
  modifier: string
): boolean | void {
  const match = modifier.match(/(?:fcs)([<>=]+)?([0-9]+)?/i);
  if (!match) return false;
  for (const result of this.results) {
    if (
      DiceTerm.compareResult(
        result.result,
        match[1] || "<=",
        parseInt(match[2])
      )
    ) {
      result.critical = "success";

      if (typeof result.count === "number") {
        result.count = 1;
      }
      if (result.success === false) {
        result.success = true;
      }
      if (result.failure === true) {
        result.failure = false;
      }
    } else if (!result.critical) {
      result.critical = "none";
    }
  }
}

/** The possible critical values a result can have */
export type Critical = "none" | "success" | "failure";
