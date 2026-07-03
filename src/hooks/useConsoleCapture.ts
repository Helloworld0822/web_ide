import { useCallback, useEffect, useRef, useState } from 'react';
import { formatLogArg } from '../lib/formatLogArg';
import type { LogEntry } from '../types';

let logId = 0;

export function useConsoleCapture() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const originLogRef = useRef<typeof console.log>(console.log);
  const originErrorRef = useRef<typeof console.error>(console.error);

  const addLog = useCallback((type: LogEntry['type'], args: unknown[]) => {
    const message = args.map(formatLogArg).join(' ');
    setLogs((prev) => [
      ...prev,
      { id: ++logId, type, message, timestamp: new Date() },
    ]);
  }, []);

  useEffect(() => {
    const originLog = originLogRef.current;
    const originError = originErrorRef.current;

    console.log = (...args: unknown[]) => {
      originLog.apply(console, args);
      addLog('log', args);
    };

    console.error = (...args: unknown[]) => {
      originError.apply(console, args);
      addLog('error', args);
    };

    return () => {
      console.log = originLog;
      console.error = originError;
    };
  }, [addLog]);

  const clearLogs = useCallback(() => setLogs([]), []);

  return { logs, clearLogs };
}
