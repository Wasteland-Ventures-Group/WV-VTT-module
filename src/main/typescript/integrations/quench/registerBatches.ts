import { CONSTANTS } from "../../constants.js";
import registerPromptTests from "../../tests/applications/prompt.js";
import { isQuenchActive } from "../index.js";

/** Register the system test batches with Quench. */
export default function registerTestBatches(): void {
  if (isQuenchActive()) {
    quench.registerBatch(
      `${CONSTANTS.systemId}.applications.prompt`,
      registerPromptTests,
      {
        displayName: `${CONSTANTS.systemName.toUpperCase()}: Prompt Application tests`
      }
    );
  }
}
