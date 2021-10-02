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
    const comp = DiceTerm.compareResult(
      result.result,
      match[1] || ">=",
      parseInt(match[2])
    );
    result.criticalFailure = comp;
    if (comp) {
      if (typeof result.count === "number") {
        result.count = 0;
      }
      if (result.success) {
        result.success = false;
      }
      result.criticalSuccess = false;
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
    const comp = DiceTerm.compareResult(
      result.result,
      match[1] || "<=",
      parseInt(match[2])
    );
    result.criticalSuccess = comp;
    if (comp) {
      if (typeof result.count === "number") {
        result.count = 1;
      }
      if (result.success === false) {
        result.success = true;
      }
      result.criticalFailure = false;
    }
  }
}
