import type { TYPES } from "../../../constants.js";
import VitalsSource from "../common/vitals/source.js";

export default interface NpcDataSource {
  type: typeof TYPES.ACTOR.NPC;
  data: NpcDataSourceData;
}

export class NpcDataSourceData {
  /** The vitals of the NPC */
  vitals = new VitalsSource();
}
