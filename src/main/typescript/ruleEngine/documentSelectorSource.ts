import type { JSONSchemaType } from "ajv";
import { z } from "zod";
import {
  SkillName,
  SkillNames,
  SystemDocumentType,
  SystemDocumentTypes,
  SYSTEM_DOCUMENT_TYPE_SCHEMA
} from "../constants.js";

export type KeywordSelectorWord = typeof KeywordSelectorsWords[number];
export const KeywordSelectorsWords = [
  "actor",
  "item",
  "parent",
  "sibling",
  "this"
] as const;

export const KEYWORD_SELECTOR_WORD_SCHEMA = z.enum(KeywordSelectorsWords);
export const KEYWORD_SELECTOR_WORD_JSON_SCHEMA: JSONSchemaType<KeywordSelectorWord> =
  {
    description: "A schema for keyword selector words",
    type: "string",
    enum: KeywordSelectorsWords,
    default: "this"
  };

export type TagSelectorSource = z.infer<typeof TAG_SELECTOR_SOURCE_SCHEMA>;
export const TAG_SELECTOR_SOURCE_SCHEMA = z.object({ tag: z.string() });
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

export const TYPE_SELECTOR_SOURCE_SCHEMA = z.object({
  type: SYSTEM_DOCUMENT_TYPE_SCHEMA
});
export const TYPE_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<TypeSelectorSource> =
  {
    description: "A schema for a type selector source",
    type: "object",
    properties: { type: { type: "string", enum: SystemDocumentTypes } },
    required: ["type"],
    additionalProperties: false
  };

export interface UsesSkillSelectorSource {
  usesSkill: SkillName;
}
export const USES_SKILL_SELECTOR_SOURCE_SCHEMA = z.object({
  usesSkill: z.enum(SkillNames)
});
export const USES_SKILL_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<UsesSkillSelectorSource> =
  {
    description: "A schema for a uses skill selector source",
    type: "object",
    properties: { usesSkill: { type: "string", enum: SkillNames } },
    required: ["usesSkill"],
    additionalProperties: false
  };

export interface OrSelectorSource {
  or: Exclude<DocumentSelectorSource, OrSelectorSource>[];
}

export const OR_SELECTOR_SOURCE_JSON_SCHEMA: JSONSchemaType<OrSelectorSource> =
  {
    description: "A schema for an or selector source",
    type: "object",
    properties: {
      or: {
        type: "array",
        items: {
          oneOf: [
            KEYWORD_SELECTOR_WORD_JSON_SCHEMA,
            TAG_SELECTOR_SOURCE_JSON_SCHEMA,
            TYPE_SELECTOR_SOURCE_JSON_SCHEMA,
            USES_SKILL_SELECTOR_SOURCE_JSON_SCHEMA
          ]
        }
      }
    },
    required: ["or"],
    additionalProperties: false
  };

export type DocumentSelectorSource =
  | KeywordSelectorWord
  | OrSelectorSource
  | TagSelectorSource
  | TypeSelectorSource
  | UsesSkillSelectorSource;

const NON_REC_DOCSELECTS = [
  KEYWORD_SELECTOR_WORD_SCHEMA,
  TAG_SELECTOR_SOURCE_SCHEMA,
  TYPE_SELECTOR_SOURCE_SCHEMA,
  USES_SKILL_SELECTOR_SOURCE_SCHEMA
] as const;

export const OR_SELECTOR_SOURCE_SCHEMA = z.object({
  or: z.array(z.union(NON_REC_DOCSELECTS))
});

export const DOCUMENTSELECTOR_SOURCE_SCHEMA = z.union([
  OR_SELECTOR_SOURCE_SCHEMA,
  ...NON_REC_DOCSELECTS
]);

export const DOCUMENT_SELECTOR_SOURCE_JSON_SCHEMA = {
  description: "A schema for document selector sources",
  oneOf: [
    KEYWORD_SELECTOR_WORD_JSON_SCHEMA,
    OR_SELECTOR_SOURCE_JSON_SCHEMA,
    TAG_SELECTOR_SOURCE_JSON_SCHEMA,
    TYPE_SELECTOR_SOURCE_JSON_SCHEMA,
    USES_SKILL_SELECTOR_SOURCE_JSON_SCHEMA
  ]
};
