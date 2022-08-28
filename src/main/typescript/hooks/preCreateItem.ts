import WvActor from "../actor/wvActor.js";
import { TYPES } from "../constants.js";
import type WvItem from "../item/wvItem.js";

export default function registerForPreCreateItem(): void {
  Hooks.on<Hooks.PreCreateDocument<typeof Item>>(
    "preCreateItem",
    replaceCharacterRace
  );
}

type HookParams = Parameters<Hooks.PreCreateDocument<typeof Item>>;

/**
 * Replace existing Race items on an actor, if a Race is created on an actor.
 */
function replaceCharacterRace(document: HookParams[0]): false | void {
  if (
    document.data.type !== TYPES.ITEM.RACE ||
    !(document.parent instanceof WvActor)
  )
    return;

  document.parent.deleteEmbeddedDocuments(
    "Item",
    document.parent.itemTypes.race
      .filter((item): item is StoredDocument<WvItem> => item.id !== null)
      .map((item) => item.id)
  );
}
