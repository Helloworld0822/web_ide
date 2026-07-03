import { executeInCodeWorker } from './codeSandbox';

export function runCode(code: string): Promise<void> {
  return executeInCodeWorker(code);
}
