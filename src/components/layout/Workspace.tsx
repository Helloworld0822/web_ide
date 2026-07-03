import { Console } from '../Console';
import { Editor } from '../Editor';
import { EditorTabs } from '../EditorTabs';
import { StatusBar } from '../StatusBar';
import { Toolbar } from '../Toolbar';
import { getLanguageLabel } from '../../lib/lsp/languages';
import type { EditorDiagnostic, LogEntry, WorkspaceFile } from '../../types';
import type { Monaco } from '@monaco-editor/react';
import type * as MonacoEditorTypes from 'monaco-editor';

interface WorkspaceProps {
  activeFile: WorkspaceFile;
  openFiles: WorkspaceFile[];
  onFileSelect: (fileId: string) => void;
  onFileClose: (fileId: string) => void;
  onContentChange: (value: string) => void;
  logs: LogEntry[];
  diagnostics: EditorDiagnostic[];
  onClearLogs: () => void;
  onRun: () => void;
  isRunning: boolean;
  onEditorMount: (
    editor: MonacoEditorTypes.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => void;
  onDiagnosticSelect: (diagnostic: EditorDiagnostic) => void;
  pendingReveal: { line: number; column: number } | null;
  onRevealComplete: () => void;
}

export function Workspace({
  activeFile,
  openFiles,
  onFileSelect,
  onFileClose,
  onContentChange,
  logs,
  diagnostics,
  onClearLogs,
  onRun,
  isRunning,
  onEditorMount,
  onDiagnosticSelect,
  pendingReveal,
  onRevealComplete,
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
          activeFile={activeFile}
          onChange={onContentChange}
          onMount={onEditorMount}
          pendingReveal={pendingReveal}
          onRevealComplete={onRevealComplete}
        />
        <Console
          logs={logs}
          diagnostics={diagnostics}
          onClear={onClearLogs}
          onDiagnosticSelect={onDiagnosticSelect}
        />
      </main>
      <StatusBar languageLabel={getLanguageLabel(activeFile.path)} />
    </div>
  );
}
