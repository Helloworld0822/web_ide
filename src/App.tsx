import { ActivityBar } from './components/ActivityBar';
import { Sidebar } from './components/Sidebar';
import { Workspace } from './components/layout/Workspace';
import { useCodeRunner } from './hooks/useCodeRunner';
import { useConsoleCapture } from './hooks/useConsoleCapture';
import { useWorkspace } from './hooks/useWorkspace';

export default function App() {
  const {
    projectName,
    activeFile,
    activeFileId,
    openFiles,
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
        onClearLogs={clearLogs}
        onRun={handleRun}
        isRunning={isRunning}
      />
    </div>
  );
}
