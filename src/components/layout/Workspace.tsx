import { Console } from '../Console';
import { Editor } from '../Editor';
import { EditorTabs } from '../EditorTabs';
import { StatusBar } from '../StatusBar';
import { Toolbar } from '../Toolbar';
import type { LogEntry, WorkspaceFile } from '../../types';

interface WorkspaceProps {
  activeFile: WorkspaceFile;
  openFiles: WorkspaceFile[];
  onFileSelect: (fileId: string) => void;
  onFileClose: (fileId: string) => void;
  onContentChange: (value: string) => void;
  logs: LogEntry[];
  onClearLogs: () => void;
  onRun: () => void;
  isRunning: boolean;
}

export function Workspace({
  activeFile,
  openFiles,
  onFileSelect,
  onFileClose,
  onContentChange,
  logs,
  onClearLogs,
  onRun,
  isRunning,
}: WorkspaceProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <Toolbar
        activeFilePath={activeFile.path}
        onRun={onRun}
        isRunning={isRunning}
      />
      <main className="flex min-h-0 flex-1 flex-col overflow-hidden bg-canvas">
        <EditorTabs
          openFiles={openFiles}
          activeFileId={activeFile.id}
          onTabSelect={onFileSelect}
          onTabClose={onFileClose}
        />
        <Editor
          key={activeFile.id}
          value={activeFile.content}
          onChange={onContentChange}
        />
        <Console logs={logs} onClear={onClearLogs} />
      </main>
      <StatusBar />
    </div>
  );
}
