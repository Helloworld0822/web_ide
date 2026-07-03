export const RUN_TIMEOUT_MS = 5000;

export type WorkerConsoleLevel = 'log' | 'error';

export type WorkerRunRequest = {
  code: string;
};

export type WorkerConsoleMessage = {
  type: 'console';
  level: WorkerConsoleLevel;
  args: unknown[];
};

export type WorkerDoneMessage = {
  type: 'done';
};

export type WorkerMessage = WorkerConsoleMessage | WorkerDoneMessage;
