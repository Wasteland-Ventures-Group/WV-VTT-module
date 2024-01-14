import type { TYPES } from "../../../constants.js";
import MagicSource from "../common/magic/source.js";
import VitalsSource from "../common/vitals/source.js";

export default interface NpcDataSource {
  type: typeof TYPES.ACTOR.NPC;
  data: NpcDataSourceData;
}

export class NpcDataSourceData {
  /** The vitals of the NPC */
  vitals = new VitalsSource();

  /** The magic of the NPC */
  magic = new MagicSource();
}
