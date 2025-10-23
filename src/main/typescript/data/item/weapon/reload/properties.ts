import { CompositeNumber } from "../../../common.js";
import { RELOAD_SCHEMA, type AmmoContainerType } from "./source.js";
import fields = foundry.data.fields;
import type { Caliber } from "../../../../constants.js";

type ReloadSource = fields.SchemaField.InitializedData<typeof RELOAD_SCHEMA>;

export default class ReloadProperties implements ReloadSource {
  constructor(source: ReloadSource) {
    this.containerType = source.containerType;

    this.ap = CompositeNumber.from(source.ap);
    this.ap.bounds.min = 0;

    this.size = CompositeNumber.from(source.size);
    this.size.bounds.min = 0;
    this.caliber = source.caliber;
  }

  containerType: AmmoContainerType;
  caliber: Caliber;
  ap: CompositeNumber;
  size: CompositeNumber;
}
