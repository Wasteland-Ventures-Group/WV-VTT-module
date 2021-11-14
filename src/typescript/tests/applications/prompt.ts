import Prompt from "../../applications/prompt.js";
import { CONSTANTS } from "../../constants.js";
import type { Quench } from "../../integrations/quench/quench.js";

const promptSelector = `.app.window-app.${CONSTANTS.systemId}.prompt form`;

export default function registerPromptTests(context: Quench.Context): void {
  const { describe, before, it, expect } = context;

  describe("When prompting for a number", function () {
    let result: number;

    before(async function () {
      result = await new Promise((resolve) => {
        new Prompt({ num: { label: "", type: "number" } }, (data) =>
          resolve(data["num"])
        )
          // @ts-expect-error We need to use this to use Promises.
          ._render(true)
          .then(() => setAndSubmit({ num: "42" }));
      });
    });

    it("returns a number.", async function () {
      expect(result).to.be.a("number");
    });

    it("returns the correct number.", function () {
      expect(result).to.be.eq(42);
    });
  });

  describe("When prompting for a string", function () {
    let result: string;

    before(async function () {
      result = await new Promise((resolve) => {
        new Prompt({ tex: { label: "", type: "text" } }, (data) =>
          resolve(data["tex"])
        )
          // @ts-expect-error We need to use this to use Promises.
          ._render(true)
          .then(() => setAndSubmit({ tex: "some text" }));
      });
    });

    it("returns a string.", async function () {
      expect(result).to.be.a("string");
    });

    it("returns the correct string.", function () {
      expect(result).to.be.eq("some text");
    });
  });

  describe("When prompting for a mixed data", function () {
    let result: Record<string, unknown>;

    before(async function () {
      result = await new Promise((resolve) => {
        new Prompt(
          {
            tex: { label: "", type: "text" },
            num: { label: "", type: "number" }
          },
          (data) => resolve(data)
        )
          // @ts-expect-error We need to use this to use Promises.
          ._render(true)
          .then(() => setAndSubmit({ tex: "some text", num: "42" }));
      });
    });

    it("returns a the correct types.", async function () {
      expect(result.tex).to.be.a("string");
      expect(result.num).to.be.a("number");
    });

    it("returns the correct values.", function () {
      expect(result.tex).to.be.eq("some text");
      expect(result.num).to.be.eq(42);
    });
  });
}

function setAndSubmit(values: Record<string, string>) {
  const prompt = document.querySelector(promptSelector);
  if (!(prompt instanceof HTMLFormElement))
    throw "The prompt was not an HTMLFormElement!";

  Object.entries(values).forEach(([name, value]) => {
    const input = prompt.querySelector(`input[name=${name}]`);
    if (!(input instanceof HTMLInputElement))
      throw "The input was not an HTMLInputElement!";
    input.value = value;
  });

  const button = prompt.querySelector("button");
  if (!(button instanceof HTMLButtonElement))
    throw "The input was not an HTMLButtonElement!";

  button.click();
}
