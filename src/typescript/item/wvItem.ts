import { TYPE_CONSTRUCTORS } from "../config.js";

/** The basic Wasteland Ventures Item. */
export default class WvItem extends Item {
  /** The ready flag for the constructor context. */
  private static readonly READY = { wastelandVentures: { ready: true } };

  /**
   * Decorate the passed context with the context ready flag.
   * @param context - the originally passed constructor context
   * @returns the decorated context
   */
  private static readyContext(
    context: ConstructorParameters<typeof Item>[1]
  ): ItemContext {
    return { ...WvItem.READY, ...context };
  }

  /**
   * Create a new WvItem or subclass registered in
   * {@link TYPE_CONSTRUCTORS.ITEMS}.
   * @see Item.constructor
   */
  constructor(
    data?: ConstructorParameters<typeof Item>[0],
    context?: ItemContext
  ) {
    // This whole thing needs to break the recursion that happens by calling the
    // super constructor, since we just return something of our own.

    // Check if we have been through the other branch at least once, if so just
    // call super.
    if (context?.wastelandVentures?.ready) {
      super(data, context);
    } else {
      if (data) {
        const constructor = TYPE_CONSTRUCTORS.ITEMS[data.type];
        if (constructor) {
          // If we are able to find a mapped constructor, then use that one
          // instead and instantiate a subclass of WvItem with the readied
          // context to break out of the recursion.
          return new constructor(data, WvItem.readyContext(context));
        }
      }

      // If we are not able to, just instantiate a WvItem with the readied
      // context to break out of the recursion.
      super(data, WvItem.readyContext(context));
    }
  }
}

/**
 * An expanded document constructor context, to hold the ready flag for items.
 */
type ItemContext = ConstructorParameters<typeof Item>[1] & {
  wastelandVentures?: {
    ready?: boolean;
  };
};
