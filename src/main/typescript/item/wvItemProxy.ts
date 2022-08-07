import { getGame } from "../foundryHelpers.js";
import WvItem, { isMappedItemType } from "./wvItem.js";

export const WvItemProxy: typeof WvItem = new Proxy(WvItem, {
  construct(
    _: typeof WvItem,
    args: ConstructorParameters<typeof WvItem>
  ): WvItem {
    const data = args[0];

    if (data && isMappedItemType(data.type)) {
      return new (getGame().wv.typeConstructors.item[data.type])(...args);
    }

    return new WvItem(...args);
  }
});
