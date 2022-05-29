import {
  RaceName,
  FlyingRaceNames,
  WingedRaceNames,
  WingedRaceName,
  FlyingRaceName
} from "../../../../constants.js";
import { CompositeNumber } from "../../../common.js";
import BackgroundSource from "./source.js";

/** A race in the system */
export class Race {
  constructor(
    /** The name of the race */
    public name: RaceName
  ) {}

  /** Check whether this race can fly. */
  get canFly(): boolean {
    return FlyingRaceNames.includes(this.name as FlyingRaceName);
  }

  /** Check whther this race has wings. */
  get hasWings(): boolean {
    return WingedRaceNames.includes(this.name as WingedRaceName);
  }
}

export default class BackgroundProperties extends BackgroundSource {
  constructor(source: BackgroundSource) {
    super();
    foundry.utils.mergeObject(this, source);
    this.size = CompositeNumber.from(source.size);
    this.race = new Race(source.raceName);
  }

  override size: CompositeNumber;

  race: Race;
}
