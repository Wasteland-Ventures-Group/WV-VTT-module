import { RULES_SCHEMA } from "../rules/source.js";
import fields = foundry.data.fields;

export type BaseItemSource = fields.SchemaField.InitializedData<typeof BASE_ITEM_SCHEMA>;

export const BASE_ITEM_SCHEMA = {
  /**
   * The name of the item in the Wasteland Wares list. This is not the name a
   * player can give their specific instance of an item, but rather the name of
   * the item "prototype".
   */
  name: new fields.StringField({ required: true, trim: true, initial: "" }),

  /** The description of the item in the Wasteland Wares list */
  description: new fields.StringField({ required: true, trim: true, initial: "" }),
  /** User provided notes */
  notes: new fields.StringField({ required: true, trim: true, initial: "" }),
  /** The RuleElement sources of the item */
  rules: new fields.SchemaField(RULES_SCHEMA),
  /** Tags of the item */
  tags: new fields.ArrayField(new fields.StringField(), { required: true }),
}
