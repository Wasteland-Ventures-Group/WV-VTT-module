import type { TemplateDocumentType } from "../common.js";
import { DbRules } from "./rules.js";

/** This holds the base values that all items have in common. */
export default abstract class BaseItem implements TemplateDocumentType {
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name = "";

  /** The description of the item in the Wasteland Wares list. */
  description = "";

  /** The rules of the item. */
  rules = new DbRules();

  /** @override */
  abstract getTypeName(): string;
}
