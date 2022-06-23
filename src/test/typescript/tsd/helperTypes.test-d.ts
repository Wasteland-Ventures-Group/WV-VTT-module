// import { expectType } from "tsd";
// import type * as helpers from "../../../main/typescript/helperTypes";

// declare const singleKey: helpers.FlattenedKeys<{ foo: string }>;
// expectType<"foo">(singleKey);
// declare const twoKeys: helpers.FlattenedKeys<{ foo: string; bar: string }>;
// expectType<"foo" | "bar">(twoKeys);
// declare const oneNestedKey: helpers.FlattenedKeys<{ foo: { bar: string } }>;
// expectType<"foo.bar">(oneNestedKey);
// declare const oneNestedTwoTopKeys: helpers.FlattenedKeys<{
//   foo: { bar: string };
//   baz: string;
// }>;
// expectType<"foo.bar" | "baz">(oneNestedTwoTopKeys);
