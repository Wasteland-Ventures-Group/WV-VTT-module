import { expectType } from "tsd";
import type * as app from "../../../../src/typescript/applications/prompt";

// InputSpecsReturnType ========================================================
declare const singleNumberReturns: app.InputSpecsReturnType<{
  number: { label: ""; type: "number" };
}>;
expectType<{ number: number }>(singleNumberReturns);
declare const multiNumberReturns: app.InputSpecsReturnType<{
  number1: { label: ""; type: "number" };
  number2: { label: ""; type: "number" };
}>;
expectType<{ number1: number; number2: number }>(multiNumberReturns);
declare const singleTextReturns: app.InputSpecsReturnType<{
  text: { label: ""; type: "text" };
}>;
expectType<{ text: string }>(singleTextReturns);
declare const multiTextReturns: app.InputSpecsReturnType<{
  text1: { label: ""; type: "text" };
  text2: { label: ""; type: "text" };
}>;
expectType<{ text1: string; text2: string }>(multiTextReturns);
declare const mixedReturns: app.InputSpecsReturnType<{
  text: { label: ""; type: "text" };
  number: { label: ""; type: "number" };
}>;
expectType<{ text: string; number: number }>(mixedReturns);

// InputSpecReturnType =========================================================
declare const numberReturn: app.InputSpecReturnType<{
  label: "";
  type: "number";
}>;
expectType<number>(numberReturn);
declare const textReturn: app.InputSpecReturnType<{ label: ""; type: "text" }>;
expectType<string>(textReturn);
declare const undefinedNumber: app.InputSpecReturnType<
  { label: ""; type: "number" } | undefined
>;
expectType<number | undefined>(undefinedNumber);
declare const undefinedString: app.InputSpecReturnType<
  { label: ""; type: "text" } | undefined
>;
expectType<string | undefined>(undefinedString);

// Callback ====================================================================
declare const callback: app.Callback<{
  text: { label: ""; type: "text" };
  number: { label: ""; type: "number" };
}>;
expectType<(data: { text: string; number: number }) => void>(callback);
