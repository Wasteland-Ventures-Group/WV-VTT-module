import type { TYPES } from "../../../constants";
import { NpcDataSourceData } from "./source";

export default interface NpcDataProperties {
  type: typeof TYPES.ACTOR.CHARACTER;
  data: NpcDataPropertiesData;
}

export class NpcDataPropertiesData extends NpcDataSourceData {}
