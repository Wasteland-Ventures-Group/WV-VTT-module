// When making changes in this file, run `./gulp.js ruleElementValidators` and
// check the output under
// `dist/wasteland-ventures/modules/validators/ruleElementSource.js`. If that
// file contains `require` calls because of the change, you need to go about it
// differently. Most of the time this happens if you want something more
// specific than a string for example and want to use a union type instead. So
// use simple types instead of unions.

/** The RuleElement raw data layout */
export default interface RuleElementSource {
  /** Whether this rule element is enabled */
  enabled: boolean;

  /** The label of the element */
  label: string;

  /** The place in the order of application, starting with lowest */
  priority: number;

  /** The selector of the element */
  selector: string;

  /**
   * Whether the RuleElement applies to the the Document or the Owning document
   */
  target: string;

  /**
   * The type identifier of the element. This has to be a simple string instead
   * of a union for now, because we would need to bundle AJV to support it
   * otherwise.
   */
  type: string;

  /** The value of the element */
  value: number;
}
