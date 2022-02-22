/**
 * Run `toFixed(fractionDigits)` on the number and remove trailing zeros and
 * potential floating point.
 *
 * @param number - the number to run the operation on
 * @param fractionDigits - the number fractional digits to round to
 * @returns the formatted number or an empty string, if not present
 */
export function toFixed(
  number: number | undefined | null,
  fractionDigits = 2
): string {
  if (typeof number !== "number") return "";

  return number.toFixed(fractionDigits).replace(/[.,]?0+$/, "");
}
