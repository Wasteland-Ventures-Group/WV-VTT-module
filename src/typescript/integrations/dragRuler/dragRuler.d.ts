// This file contains self-written types for the drag-ruler module and copied
// documentation comments.

import { RangeIds } from "./wvSpeedProvider.js";

declare global {
  const dragRuler: DragRuler.Global | undefined;
}

export declare namespace DragRuler {
  /**
   * Base class for all speed providers.
   * If you want to offer a speed provider in your system/module you must derive
   * this class.
   * Each speed provider must at least implement
   */
  abstract class SpeedProvider {
    /**
     * Returns an array of colors used by this speed provider. Each color
     * corresponds to one speed that a token may have.
     */
    abstract get colors(): Color[];

    /**
     * Returns an array of speeds that the token passed in the arguments this
     * token can reach.
     */
    abstract getRanges(token: Token): Range[];
  }

  interface Color {
    /**
     * A value that identfies the color. Must be unique for each color returned.
     */
    id: RangeIds;

    /** The color that is used to highlight that speed by default. */
    default: number;

    /**
     * A user readable name for the speed represented by the color. This name is
     * used in the color configuration dialog. Drag Ruler will attempt to
     * localize this string using `game.i18n`
     */
    name?: string;
  }

  interface Range {
    /**
     * The id (as defined in the `colors` getter) of the color that should be
     * used to represent this range
     */
    color: RangeIds;

    /**
     * A number indicating the distance that the token can travel with this
     * speed
     */
    range: number;
  }

  interface Global {
    registerModule(
      moduleId: string,
      speedProvider: ConstructorOf<SpeedProvider>
    ): void;

    registerSystem(
      systemId: string,
      speedProvider: ConstructorOf<SpeedProvider>
    ): void;
  }
}
