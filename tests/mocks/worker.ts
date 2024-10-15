import type { SetupWorker } from "msw/browser";
import { mockHandlers } from "./handlers";

let mockWorker: SetupWorker | undefined = undefined;

//NOTE - Will never return undefined if it's called from a browser
async function getMockWorker() {
  if (!mockWorker && typeof window !== "undefined") {
    const { setupWorker } = await import("msw/browser");
    mockWorker = setupWorker(...mockHandlers);
  }

  return mockWorker;
}

export const mockWorkerService = {
  start: () =>
    getMockWorker().then((mockWorker) => {
      mockWorker?.start();
    }),
  stop: () =>
    getMockWorker().then((mockWorker) => {
      mockWorker?.stop();
    }),
};
