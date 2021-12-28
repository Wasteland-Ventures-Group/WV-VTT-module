import { CONSTANTS } from "../../constants.js";
import registerPromptTests from "../../tests/applications/prompt.js";

/** Register the system test batches with Quench. */
export default function registerTestBatches(): void {
  if (hasProperty(window, "quench")) {
    quench.registerBatch(
      `${CONSTANTS.systemId}.applications.prompt`,
      registerPromptTests,
      {
        displayName: `${CONSTANTS.systemName.toUpperCase()}: Prompt Application tests`
      }
    );
  }
}
