import registerForDragRulerReady from "./dragRuler/ready.js";
import registerForInit from "./init.js";
import registerForReady from "./ready.js";

export default function registerForHooks(): void {
  registerForInit();
  registerForReady();
  registerForDragRulerReady();
}
