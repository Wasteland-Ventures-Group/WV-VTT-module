import * as helpers from "../../../main/typescript/helpers.js";
import { expect } from "chai";
import { describe, it } from "mocha";

describe("helpers", function () {
  describe("#toFixed()", function () {
    describe("When given an integer", function () {
      let result = helpers.toFixed(42);
      it("returns that integer as a string without decimals", function () {
        expect(result).to.eq("42");
      });
    });

    describe("When given a float with more than two decimals", function () {
      let result = helpers.toFixed(10.123465789);
      it("returns that float as a string rounded to two decimals", function () {
        expect(result).to.eq("10.12");
      });
    });

    describe("When given a float with less than two decimals", function () {
      let result = helpers.toFixed(10.1);
      it("returns that float as a string with the decimals", function () {
        expect(result).to.eq("10.1");
      });
    });

    describe("When given a float with a third decimal of 6", function () {
      let result = helpers.toFixed(10.126);
      it("returns that float as a string rounded to two decimals", function () {
        expect(result).to.eq("10.13");
      });
    });

    describe("When given a float with 1st or 2nd decimal 0", function () {
      let result = helpers.toFixed(10.103);
      it("returns that float with trailing zeros removed", function () {
        expect(result).to.eq("10.1");
      });
    });

    describe("When given a float with 1st and 2nd decimal 0", function () {
      let result = helpers.toFixed(10.003);
      it("returns that float with trailing zeros and period removed", function () {
        expect(result).to.eq("10");
      });
    });
  });
});
