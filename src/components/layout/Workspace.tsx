import { Console } from '../Console';
import { Editor } from '../Editor';
import { EditorTabs } from '../EditorTabs';
import { StatusBar } from '../StatusBar';
import { Toolbar } from '../Toolbar';
import type { LogEntry } from '../../types';

interface WorkspaceProps {
  code: string;
  onCodeChange: (value: string) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  onRun: () => void;
  isRunning: boolean;
}

export function Workspace({
  code,
  onCodeChange,
  logs,
  onClearLogs,
  onRun,
  isRunning,
}: WorkspaceProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Toolbar onRun={onRun} isRunning={isRunning} />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-canvas">
        <EditorTabs />
        <Editor value={code} onChange={onCodeChange} />
        <Console logs={logs} onClear={onClearLogs} />
      </main>
      <StatusBar />
    </div>
  );
}
