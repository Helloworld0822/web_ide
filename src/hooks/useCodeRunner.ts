import { useCallback, useState } from 'react';
import { runCode } from '../lib/runCode';

export function useCodeRunner(code: string) {
  const [isRunning, setIsRunning] = useState(false);

  const handleRun = useCallback(async () => {
    setIsRunning(true);
    try {
      await runCode(code);
    } catch (err) {
      console.error(err instanceof Error ? err.message : String(err));
    } finally {
      setIsRunning(false);
    }
  }, [code]);

  return { isRunning, handleRun };
}
