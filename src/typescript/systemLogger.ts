import { CONSTANTS } from "./constants.js";

/** A logger for the system, decorating log messages with a given context. */
export default class SystemLogger {
  /** @param context - the context to set for this instance */
  constructor(context: string) {
    this.context = context;
  }

  private context: string;

  /** Log a message in debug level. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trace(...args: any[]): void {
    console.trace(this.getContext(), ...args);
  }

  /** Log a message in debug level. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  debug(...args: any[]): void {
    console.debug(this.getContext(), ...args);
  }

  /** Log a message in info level. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info(...args: any[]): void {
    console.info(this.getContext(), ...args);
  }

  /** Log a message in warn level. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  warn(...args: any[]): void {
    console.warn(this.getContext(), ...args);
  }

  /** Log a message in error level. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(...args: any[]): void {
    console.error(this.getContext(), ...args);
  }

  /** Get the context of this instance. */
  private getContext(): string {
    return `${this.context} | `;
  }
}

/** The system default logger, with the system name as context. */
export const LOG = new SystemLogger(CONSTANTS.systemName);
