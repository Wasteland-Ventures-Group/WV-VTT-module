import type { JSONSchemaType } from "ajv";
import { SystemDocumentType, SystemDocumentTypes } from "../constants.js";

export type KeywordSelectorWord = typeof KeywordSelectorsWords[number];
export const KeywordSelectorsWords = [
  "actor",
  "item",
  "parent",
  "sibling",
  "this"
] as const;
export const KEYWORD_SELECTOR_WORD_JSON_SCHEMA: JSONSchemaType<KeywordSelectorWord> =
  {
    description: "A schema for keyword selector words",
    type: "string",
    enum: KeywordSelectorsWords,
    default: "this"
  };

export interface TagSelectorSource {
  tag: string;
}
export const TAG_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<TagSelectorSource> =
  {
    description: "A schema for a tag selector source",
    type: "object",
    properties: { tag: { type: "string" } },
    required: ["tag"],
    additionalProperties: false
  };

export interface TypeSelectorSource {
  type: SystemDocumentType;
}
export const TYPE_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<TypeSelectorSource> =
  {
    description: "A schema for a type selector source",
    type: "object",
    properties: { type: { type: "string", enum: SystemDocumentTypes } },
    required: ["type"],
    additionalProperties: false
  };

export type DocumentSelectorSource =
  | KeywordSelectorWord
  | TagSelectorSource
  | TypeSelectorSource;
export const DOCUMENT_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<DocumentSelectorSource> =
  {
    description: "A schema for document selector sources",
    oneOf: [
      KEYWORD_SELECTOR_WORD_JSON_SCHEMA,
      TAG_SELECTOR_SOURCE_JSON_SCHEMA,
      TYPE_SELECTOR_SOURCE_JSON_SCHEMA
    ]
  };
