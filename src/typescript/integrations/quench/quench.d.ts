import type * as chai from "chai";
import type * as mocha from "mocha";

declare global {
  const quench: Quench.Quench | undefined;
}

export declare namespace Quench {
  class Quench {
    registerBatch(
      key: string,
      registrationFunction: (context: Context) => void,
      options?: Options
    ): void;
  }

  interface Context {
    describe: typeof mocha.describe;
    it: typeof mocha.it;
    after: typeof mocha.after;
    afterEach: typeof mocha.afterEach;
    before: typeof mocha.before;
    beforeEach: typeof mocha.beforeEach;
    utils: typeof mocha.utils;
    assert: typeof chai.assert;
    expect: typeof chai.expect;
    should: typeof chai.should;
  }

  interface Options {
    displayName?: string | undefined;
    snapBaseDir?: string | undefined;
  }
}

export {};
