import { useState } from 'react';
import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/layout/Workspace';
import { useCodeRunner } from './hooks/useCodeRunner';
import { useConsoleCapture } from './hooks/useConsoleCapture';
import { useLsp } from './hooks/useLsp';
import { useWorkspace } from './hooks/useWorkspace';
import type { EditorDiagnostic } from './types';

export default function App() {
  const {
    projectName,
    files,
    activeFile,
    activeFileId,
    openFiles,
    openFileIds,
    tree,
    source,
    isLoading,
    isOpeningFolder,
    hasDirectoryPicker,
    folderInputRef,
    filesInputRef,
    selectFile,
    closeFile,
    updateActiveFileContent,
    openLocalFolder,
    importFiles,
    loadFromBrowserStorage,
    resetWorkspace,
    onFolderInputChange,
    onFilesInputChange,
  } = useWorkspace();

  const { logs, clearLogs } = useConsoleCapture();
  const { isRunning, handleRun } = useCodeRunner(activeFile?.content ?? '');
  const { diagnostics, handleEditorMount } = useLsp({
    files: files ?? {},
    openFileIds,
  });

  const [revealTarget, setRevealTarget] = useState<{
    fileId: string;
    line: number;
    column: number;
  } | null>(null);

  const pendingReveal =
    revealTarget?.fileId === activeFileId
      ? { line: revealTarget.line, column: revealTarget.column }
      : null;

  const handleDiagnosticSelect = (diagnostic: EditorDiagnostic) => {
    if (diagnostic.fileId !== activeFileId) {
      selectFile(diagnostic.fileId);
      setRevealTarget({
        fileId: diagnostic.fileId,
        line: diagnostic.line,
        column: diagnostic.column,
      });
      return;
    }

    setRevealTarget({
      fileId: diagnostic.fileId,
      line: diagnostic.line,
      column: diagnostic.column,
    });
  };

  if (isLoading || !activeFile) {
    return (
      <div className="flex h-full items-center justify-center bg-canvas text-on-surface-variant">
        Loading workspace from browser storage...
      </div>
    );
  }

  return (
    <div className="flex h-full w-full">
      <ActivityBar />
      <Sidebar
        projectName={projectName}
        tree={tree}
        activeFileId={activeFileId}
        source={source}
        isOpeningFolder={isOpeningFolder}
        hasDirectoryPicker={hasDirectoryPicker}
        folderInputRef={folderInputRef}
        filesInputRef={filesInputRef}
        onFileSelect={selectFile}
        onOpenFolder={() => void openLocalFolder()}
        onImportFiles={importFiles}
        onLoadFromStorage={() => void loadFromBrowserStorage()}
        onResetWorkspace={resetWorkspace}
        onFolderInputChange={onFolderInputChange}
        onFilesInputChange={onFilesInputChange}
      />
      <Workspace
        activeFile={activeFile}
        openFiles={openFiles}
        onFileSelect={selectFile}
        onFileClose={closeFile}
        onContentChange={updateActiveFileContent}
        logs={logs}
        diagnostics={diagnostics}
        onClearLogs={clearLogs}
        onRun={handleRun}
        isRunning={isRunning}
        onEditorMount={handleEditorMount}
        onDiagnosticSelect={handleDiagnosticSelect}
        pendingReveal={pendingReveal}
        onRevealComplete={() => setRevealTarget(null)}
      />
    </div>
  );
}
