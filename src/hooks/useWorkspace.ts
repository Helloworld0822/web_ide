import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import type { TreeItem } from '../constants/ide';
import { loadWorkspaceFromBrowserStorage } from '../lib/storage/loadBrowserWorkspace';
import { saveWorkspace, loadWorkspace } from '../lib/storage/workspaceStore';
import {
  createDefaultWorkspace,
  loadWorkspaceFromFolder,
  loadWorkspaceFromImportedFiles,
  supportsDirectoryPicker,
} from '../lib/workspace/localFolder';
import type { WorkspaceFile } from '../types';

function markActiveTree(items: TreeItem[], activeFileId: string): TreeItem[] {
  return items.map((item) => {
    if (item.type === 'folder') {
      return {
        ...item,
        children: item.children ? markActiveTree(item.children, activeFileId) : [],
      };
    }
    return { ...item, active: item.id === activeFileId };
  });
}

export function useWorkspace() {
  const [projectName, setProjectName] = useState('web-ide');
  const [files, setFiles] = useState<Record<string, WorkspaceFile> | null>(null);
  const [tree, setTree] = useState<TreeItem[]>([]);
  const [activeFileId, setActiveFileId] = useState('');
  const [openFileIds, setOpenFileIds] = useState<string[]>([]);
  const [source, setSource] = useState<'default' | 'local' | 'folder'>('default');
  const [isLoading, setIsLoading] = useState(true);
  const [isOpeningFolder, setIsOpeningFolder] = useState(false);
  const saveTimerRef = useRef<number | null>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  const hasDirectoryPicker = supportsDirectoryPicker();

  const activeTree = useMemo(
    () => markActiveTree(tree, activeFileId),
    [tree, activeFileId],
  );

  const activeFile = files?.[activeFileId];
  const openFiles = useMemo(
    () => openFileIds.map((id) => files?.[id]).filter(Boolean) as WorkspaceFile[],
    [files, openFileIds],
  );

  const applyWorkspace = useCallback((workspace: {
    projectName: string;
    files: Record<string, WorkspaceFile>;
    tree: TreeItem[];
    activeFileId: string;
    openFileIds: string[];
    source: 'default' | 'local' | 'folder';
  }) => {
    setProjectName(workspace.projectName);
    setFiles(workspace.files);
    setTree(workspace.tree);
    setActiveFileId(workspace.activeFileId);
    setOpenFileIds(workspace.openFileIds);
    setSource(workspace.source);
  }, []);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const saved = await loadWorkspace();
      if (cancelled) return;

      if (saved) {
        applyWorkspace({ ...saved, source: saved.source ?? 'local' });
      } else {
        applyWorkspace(createDefaultWorkspace());
      }

      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [applyWorkspace]);

  useEffect(() => {
    if (!files || isLoading) return;

    if (saveTimerRef.current) {
      window.clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = window.setTimeout(() => {
      void saveWorkspace({
        projectName,
        files,
        tree,
        activeFileId,
        openFileIds,
        source,
      });
    }, 400);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [projectName, files, tree, activeFileId, openFileIds, source, isLoading]);

  const selectFile = useCallback((fileId: string) => {
    if (!files?.[fileId]) return;
    setActiveFileId(fileId);
    setOpenFileIds((prev) => (prev.includes(fileId) ? prev : [...prev, fileId]));
  }, [files]);

  const closeFile = useCallback((fileId: string) => {
    setOpenFileIds((prev) => {
      if (prev.length === 1) return prev;

      const nextOpen = prev.filter((id) => id !== fileId);
      if (fileId === activeFileId) {
        const closedIndex = prev.indexOf(fileId);
        const nextActive = nextOpen[Math.max(0, closedIndex - 1)] ?? nextOpen[0];
        setActiveFileId(nextActive);
      }
      return nextOpen;
    });
  }, [activeFileId]);

  const updateActiveFileContent = useCallback((content: string) => {
    setFiles((prev) => {
      if (!prev?.[activeFileId]) return prev;
      return {
        ...prev,
        [activeFileId]: { ...prev[activeFileId], content },
      };
    });
  }, [activeFileId]);

  const handleImportedFiles = useCallback(async (fileList: FileList, name: string) => {
    setIsOpeningFolder(true);
    try {
      const workspace = await loadWorkspaceFromImportedFiles(fileList, name);
      applyWorkspace(workspace);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to import files';
      console.error(message);
      window.alert(message);
    } finally {
      setIsOpeningFolder(false);
    }
  }, [applyWorkspace]);

  const openLocalFolder = useCallback(async () => {
    if (!hasDirectoryPicker) {
      folderInputRef.current?.click();
      return;
    }

    setIsOpeningFolder(true);
    try {
      const workspace = await loadWorkspaceFromFolder();
      applyWorkspace(workspace);
    } catch (error) {
      if (error instanceof Error && error.message === 'FALLBACK_FILE_INPUT') {
        folderInputRef.current?.click();
        return;
      }
      const message = error instanceof Error ? error.message : 'Failed to open folder';
      console.error(message);
      window.alert(message);
    } finally {
      setIsOpeningFolder(false);
    }
  }, [applyWorkspace, hasDirectoryPicker]);

  const importFiles = useCallback(() => {
    filesInputRef.current?.click();
  }, []);

  const loadFromBrowserStorage = useCallback(async () => {
    setIsOpeningFolder(true);
    try {
      const saved = await loadWorkspaceFromBrowserStorage();
      if (!saved) {
        window.alert('No saved project found in browser storage.');
        return;
      }
      applyWorkspace(saved);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load saved project';
      console.error(message);
      window.alert(message);
    } finally {
      setIsOpeningFolder(false);
    }
  }, [applyWorkspace]);

  const resetWorkspace = useCallback(() => {
    applyWorkspace(createDefaultWorkspace());
  }, [applyWorkspace]);

  const onFolderInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    event.target.value = '';
    if (!fileList || fileList.length === 0) return;

    const rootName = fileList[0].webkitRelativePath.split('/')[0] || 'imported-folder';
    void handleImportedFiles(fileList, rootName);
  }, [handleImportedFiles]);

  const onFilesInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    event.target.value = '';
    if (!fileList || fileList.length === 0) return;

    void handleImportedFiles(fileList, 'imported-files');
  }, [handleImportedFiles]);

  return {
    projectName,
    files,
    tree: activeTree,
    activeFile,
    activeFileId,
    openFiles,
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
  };
}
