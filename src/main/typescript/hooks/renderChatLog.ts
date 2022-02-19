import { CONSTANTS } from "../constants.js";

export default function registerForRenderChatLog(): void {
  Hooks.on<Hooks.RenderApplication<ChatLog>>(
    "renderChatLog",
    addChatMessageDetailsListener
  );
}

type HookParams = Parameters<Hooks.RenderApplication<ChatLog>>;

/**
 * Register an event listener for when detail sections are clicked on WV
 * messages.
 */
function addChatMessageDetailsListener(_: HookParams[0], html: HookParams[1]) {
  const chatLog = html[0];
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
