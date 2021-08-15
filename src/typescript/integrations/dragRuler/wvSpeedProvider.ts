import type { DragRuler } from "./dragRuler.js";

import WvActor from "../../actor/wvActor.js";

export function createWvSpeedProvider(
  speedProvider: typeof DragRuler.SpeedProvider
): ConstructorOf<DragRuler.SpeedProvider> {
  return class WvSpeedProvider extends speedProvider {
    override get colors(): DragRuler.Color[] {
      return [
        { id: "walk", default: 0x00ff00 },
        { id: "sprint", default: 0xffff00 }
      ];
    }

    override getRanges(token: Token): DragRuler.Range[] {
      if (!(token.actor instanceof WvActor)) return [];

      const actor: WvActor = token.actor;
      return [
        { color: "walk", range: actor.groundMoveRange },
        { color: "sprint", range: actor.groundSprintMoveRange }
      ];
    }
  };
}

export declare type RangeIds = "walk" | "sprint";
