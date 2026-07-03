import {
  RUN_TIMEOUT_MS,
  type WorkerMessage,
  type WorkerRunRequest,
} from './workerProtocol';

function relayConsoleOutput(message: WorkerMessage): boolean {
  if (message.type !== 'console') return false;

  if (message.level === 'error') {
    console.error(...message.args);
  } else {
    console.log(...message.args);
  }

  return true;
}

export function executeInCodeWorker(code: string): Promise<void> {
  return new Promise((resolve) => {
    const worker = new Worker(new URL('./codeWorker.ts', import.meta.url), {
      type: 'module',
    });

    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      worker.terminate();
      resolve();
    };

    const timeoutId = window.setTimeout(() => {
      console.error(`Execution timed out after ${RUN_TIMEOUT_MS / 1000}s`);
      finish();
    }, RUN_TIMEOUT_MS);

    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;

      if (relayConsoleOutput(message)) return;
      if (message.type === 'done') finish();
    };

    worker.onerror = (event) => {
      console.error(event.message || 'Worker execution failed');
      finish();
    };

    const payload: WorkerRunRequest = { code };
    worker.postMessage(payload);
  });
}
