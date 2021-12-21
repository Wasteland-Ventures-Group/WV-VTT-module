import { configureFoundryOnReady } from "../config.js";
import { CONSTANTS } from "../constants.js";
import { getGame } from "../foundryHelpers.js";
import { migrateWorld, migrationNeeded } from "../migrations/world.js";
import { initializedSettingName } from "../settings.js";

/** Register system callbacks for the ready hook. */
export default function registerForReady(): void {
  Hooks.once("ready", ready);
}

/** Run the necessary things once foundry is ready. */
function ready(): void {
  configureFoundryOnReady();
  migrate();
  getGame().settings.set(CONSTANTS.systemId, initializedSettingName, true);
  addChatMessageDetailsListener();
}

/** Run the system migrations, if needed. */
function migrate(): void {
  if (migrationNeeded()) {
    migrateWorld();
  }
}

/**
 * Register an event listener for when detail sections are clicked on WV
 * messages.
 */
function addChatMessageDetailsListener() {
  const chatLog = document.getElementById("chat-log");
  if (chatLog instanceof HTMLElement) {
    chatLog.addEventListener("click", function (event: Event) {
      for (
        let target = event.target;
        target instanceof HTMLElement && target != this;
        target = target.parentNode
      ) {
        if (target.matches(`.${CONSTANTS.systemId} .detail-section`)) {
          onDetailSectionClick.call(target);
          break;
        }
      }
    });
  }
}

/** An event handler for clicks on detail sections. */
function onDetailSectionClick(this: HTMLElement): void {
  $(this).find(".detail-content").slideToggle(200);
}
