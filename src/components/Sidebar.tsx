import type { ChangeEvent, RefObject } from 'react';
import type { TreeItem } from '../constants/ide';
import { BRANCHES } from '../constants/ide';
import { BranchesList } from './explorer/BranchesList';
import { FileTree } from './explorer/FileTree';
import { Icon } from './Icon';

interface SidebarProps {
  projectName: string;
  tree: TreeItem[];
  activeFileId: string;
  source: 'default' | 'local' | 'folder';
  isOpeningFolder: boolean;
  hasDirectoryPicker: boolean;
  folderInputRef: RefObject<HTMLInputElement | null>;
  filesInputRef: RefObject<HTMLInputElement | null>;
  onFileSelect: (fileId: string) => void;
  onOpenFolder: () => void;
  onImportFiles: () => void;
  onLoadFromStorage: () => void;
  onResetWorkspace: () => void;
  onFolderInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFilesInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function Sidebar({
  projectName,
  tree,
  activeFileId,
  source,
  isOpeningFolder,
  hasDirectoryPicker,
  folderInputRef,
  filesInputRef,
  onFileSelect,
  onOpenFolder,
  onImportFiles,
  onLoadFromStorage,
  onResetWorkspace,
  onFolderInputChange,
  onFilesInputChange,
}: SidebarProps) {
  const folderButtonLabel = hasDirectoryPicker
    ? isOpeningFolder
      ? 'Opening folder...'
      : 'Open Local Folder'
    : isOpeningFolder
      ? 'Importing folder...'
      : 'Import Folder';

  const storageLabel =
    source === 'folder'
      ? 'Imported into browser storage'
      : source === 'local'
        ? 'Loaded from browser storage'
        : 'Sample project';

  return (
    <aside className="z-40 flex h-full w-80 shrink-0 flex-col border-r border-border bg-surface-container-lowest">
      <input
        ref={folderInputRef}
        type="file"
        className="hidden"
        // @ts-expect-error non-standard directory upload attribute
        webkitdirectory=""
        directory=""
        multiple
        onChange={onFolderInputChange}
      />
      <input
        ref={filesInputRef}
        type="file"
        className="hidden"
        multiple
        accept=".js,.ts,.tsx,.jsx,.json,.css,.html,.md,.txt,.sh,.sql,.yaml,.yml,.xml,.env"
        onChange={onFilesInputChange}
      />

      <div className="flex h-9 items-center justify-between border-b border-border bg-canvas px-4">
        <span className="text-label-caps font-bold tracking-wider text-on-surface-variant uppercase">
          Explorer
        </span>
        <Icon name="more_horiz" className="cursor-pointer text-sm text-on-surface-variant" />
      </div>

      <div className="space-y-2 border-b border-border px-3 py-2">
        <button
          type="button"
          onClick={onOpenFolder}
          disabled={isOpeningFolder}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-container-low px-3 py-2 text-body-sm font-medium text-on-surface transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Icon name="folder_open" className="text-base" />
          {folderButtonLabel}
        </button>

        <button
          type="button"
          onClick={onImportFiles}
          disabled={isOpeningFolder}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border px-3 py-2 text-body-sm text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Icon name="upload_file" className="text-base" />
          Import Files
        </button>

        <button
          type="button"
          onClick={onLoadFromStorage}
          disabled={isOpeningFolder}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-surface-container px-3 py-2 text-body-sm text-on-surface-variant transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-50"
        >
          <Icon name="cloud_download" className="text-base" />
          Load from Browser Storage
        </button>

        <button
          type="button"
          onClick={onResetWorkspace}
          className="w-full text-center text-[10px] text-on-surface-variant transition-colors hover:text-on-surface"
        >
          Reset to sample project
        </button>

        <p className="text-center text-[10px] leading-relaxed text-on-surface-variant/80">
          {storageLabel}
          {!hasDirectoryPicker && (
            <>
              <br />
              Folder picker unavailable — using file import + browser storage
            </>
          )}
          {' · auto-saved'}
        </p>
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto py-2">
        <FileTree
          projectName={projectName}
          items={tree}
          activeFileId={activeFileId}
          onFileSelect={onFileSelect}
        />
        <BranchesList branches={BRANCHES} />
      </div>
    </aside>
  );
}
