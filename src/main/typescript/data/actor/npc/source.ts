import type { TYPES } from "../../../constants.js";

export default interface NpcDataSource {
  type: typeof TYPES.ACTOR.NPC;
  data: NpcDataSourceData;
}

export class NpcDataSourceData {}
