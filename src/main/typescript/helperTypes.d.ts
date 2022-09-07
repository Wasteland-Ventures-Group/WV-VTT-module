/**
 * A type to convert nested properties of an object type into arrays of
 * strings.
 */
export type PathsToStringProps<T> = T extends string
  ? []
  : {
      [Key in Extract<keyof T, string>]: [Key, ...PathsToStringProps<T[Key]>];
    }[Extract<keyof T, string>];

/** A type to join string arrays into single strings with a delimiter. */
export type Join<
  Array extends string[],
  Delimiter extends string
> = Array extends []
  ? never
  : Array extends [infer First]
  ? First
  : Array extends [infer First, ...infer Rest]
  ? First extends string
    ? `${First}${Delimiter}${Join<Extract<Rest, string[]>, Delimiter>}`
    : never
  : string;
