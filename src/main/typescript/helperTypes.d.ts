/** A helper type to specify some kind of constructor function */
// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
export type AnyConstructor = new (...args: any[]) => {};

export type FlattenedKeys<
  T extends Record<string, string | Record<string, unknown>>
> = keyof InnerFlattenedKeys<T>;

type InnerFlattenedKeys<T> = {
  [K in keyof T]: K extends string | number
    ? T[K] extends string | number | boolean
      ? K
      : InnerFlattenedKeys<T[K]> extends string | number
      ? `${K}.${InnerFlattenedKeys<T[K]>}`
      : never
    : never;
};
