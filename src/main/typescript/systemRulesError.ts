/** A specific error to represent system rules violations. */
export default class SystemRulesError extends Error {
  constructor(message?: string, public key?: string) {
    super(message);
  }
}
