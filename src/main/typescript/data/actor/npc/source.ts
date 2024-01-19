import type { TYPES } from "../../../constants.js";
import EquipmentSource from "../common/equipment/source.js";
import MagicSource from "../common/magic/source.js";
import SpecialsSource from "../common/specials/source.js";
import VitalsSource from "../common/vitals/source.js";

export default interface NpcDataSource {
  type: typeof TYPES.ACTOR.NPC;
  data: NpcDataSourceData;
}

export class NpcDataSourceData {
  /** The equipment of the character */
  equipment = new EquipmentSource();

  /** The vitals of the NPC */
  vitals = new VitalsSource();

  /** The magic of the NPC */
  magic = new MagicSource();

  /** The SPECIALs of the NPC */
  specials = new SpecialsSource();
}
