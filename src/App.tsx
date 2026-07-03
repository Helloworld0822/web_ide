import { useState } from 'react';
import { DEFAULT_CODE } from './constants/ide';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/layout/Workspace';
import { useCodeRunner } from './hooks/useCodeRunner';
import { useConsoleCapture } from './hooks/useConsoleCapture';

export default function App() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const { logs, clearLogs } = useConsoleCapture();
  const { isRunning, handleRun } = useCodeRunner(code);

  return (
    <div className="flex h-full w-full">
      <ActivityBar />
      <Sidebar />
      <Workspace
        code={code}
        onCodeChange={setCode}
        logs={logs}
        onClearLogs={clearLogs}
        onRun={handleRun}
        isRunning={isRunning}
      />
    </div>
  );
}
