import { getGame } from "../foundryHelpers.js";

/** Check whether the Dice So Nice! module is active. */
export function isDiceSoNiceActive(): boolean {
  return isModuleActive("dice-so-nice");
}

/** Check whether the Drag-Ruler module is active. */
export function isDragRulerActive(): boolean {
  return isModuleActive("drag-ruler");
}

/** Check whether the Quench module is active. */
export function isQuenchActive(): boolean {
  return isModuleActive("quench");
}

function isModuleActive(name: string): boolean {
  return getGame().modules.get(name)?.active ?? false;
}
