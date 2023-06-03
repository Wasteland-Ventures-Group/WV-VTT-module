import type { WvI18nKey } from "./lang";

/** A specific error to represent system rules violations. */
export default class SystemRulesError extends Error {
  constructor(message?: string, public key?: WvI18nKey) {
    super(message);
  }
}
