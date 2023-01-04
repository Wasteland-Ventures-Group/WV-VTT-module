import { z } from "zod";
import {
  SkillName,
  SkillNames,
  SystemDocumentType,
  SYSTEM_DOCUMENT_TYPE_SCHEMA
} from "../constants.js";
import { zObject } from "../data/common.js";

export type KeywordSelectorWord = typeof KeywordSelectorsWords[number];
export const KeywordSelectorsWords = [
  "actor",
  "item",
  "parent",
  "sibling",
  "this"
] as const;

export const KEYWORD_SELECTOR_WORD_SOURCE_SCHEMA = z.enum(
  KeywordSelectorsWords
);

export type TagSelectorSource = z.infer<typeof TAG_SELECTOR_SOURCE_SCHEMA>;
export const TAG_SELECTOR_SOURCE_SCHEMA = zObject({ tag: z.string() });

export interface TypeSelectorSource {
  type: SystemDocumentType;
}

export const TYPE_SELECTOR_SOURCE_SCHEMA = zObject({
  type: SYSTEM_DOCUMENT_TYPE_SCHEMA
});

export interface UsesSkillSelectorSource {
  usesSkill: SkillName;
}
export const USES_SKILL_SELECTOR_SOURCE_SCHEMA = zObject({
  usesSkill: z.enum(SkillNames)
});

export interface OrSelectorSource {
  or: Exclude<DocumentSelectorSource, OrSelectorSource>[];
}

export type DocumentSelectorSource =
  | KeywordSelectorWord
  | OrSelectorSource
  | TagSelectorSource
  | TypeSelectorSource
  | UsesSkillSelectorSource;

const NON_REC_DOCSELECTS = [
  KEYWORD_SELECTOR_WORD_SOURCE_SCHEMA,
  TAG_SELECTOR_SOURCE_SCHEMA,
  TYPE_SELECTOR_SOURCE_SCHEMA,
  USES_SKILL_SELECTOR_SOURCE_SCHEMA
] as const;

export const OR_SELECTOR_SOURCE_SCHEMA = zObject({
  or: z.array(z.union(NON_REC_DOCSELECTS))
});

export const DOCUMENT_SELECTOR_SCHEMA = z.union([
  OR_SELECTOR_SOURCE_SCHEMA,
  ...NON_REC_DOCSELECTS
]);
