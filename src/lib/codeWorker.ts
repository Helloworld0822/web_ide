import type { WorkerRunRequest } from './workerProtocol';

const consoleProxy = {
  log: (...args: unknown[]) => {
    self.postMessage({ type: 'console', level: 'log', args });
  },
  error: (...args: unknown[]) => {
    self.postMessage({ type: 'console', level: 'error', args });
  },
};

self.onmessage = (event: MessageEvent<WorkerRunRequest>) => {
  try {
    const runner = new Function('console', `"use strict";\n${event.data.code}`);
    runner(consoleProxy);
    self.postMessage({ type: 'done' });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    consoleProxy.error(message);
    self.postMessage({ type: 'done' });
  }
};
