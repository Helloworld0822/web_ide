import type { TreeItem } from '../../constants/ide';
import {
  DEFAULT_ACTIVE_FILE_ID,
  INITIAL_WORKSPACE_FILES,
} from '../../constants/ide';
import type { WorkspaceFile } from '../../types';
import { supportsDirectoryPicker } from './browserSupport';
import { loadWorkspaceFromFileList } from './fileImport';
import { buildTreeFromFiles } from './buildTree';

const TEXT_EXTENSIONS = new Set([
  '.js', '.ts', '.tsx', '.jsx', '.json', '.css', '.html', '.md', '.txt',
  '.sh', '.sql', '.yaml', '.yml', '.xml', '.env', '.gitignore',
]);

const MAX_FILE_SIZE = 1024 * 1024;

function guessFileType(name: string): WorkspaceFile['type'] {
  return name.endsWith('.json') || name.endsWith('.yaml') || name.endsWith('.yml')
    ? 'config'
    : 'file';
}

async function readDirectoryHandle(
  handle: FileSystemDirectoryHandle,
  basePath = '',
): Promise<Record<string, WorkspaceFile>> {
  const files: Record<string, WorkspaceFile> = {};

  for await (const [name, entry] of handle.entries()) {
    const path = basePath ? `${basePath}/${name}` : name;

    if (entry.kind === 'directory') {
      Object.assign(files, await readDirectoryHandle(entry as FileSystemDirectoryHandle, path));
      continue;
    }

    if (entry.kind !== 'file') continue;

    const fileHandle = entry as FileSystemFileHandle;
    const file = await fileHandle.getFile();
    if (file.size > MAX_FILE_SIZE) continue;

    const dotIndex = name.lastIndexOf('.');
    const ext = dotIndex >= 0 ? name.slice(dotIndex).toLowerCase() : '';
    if (ext && !TEXT_EXTENSIONS.has(ext)) continue;

    const type = guessFileType(name);
    files[path] = {
      id: path,
      name,
      path,
      type,
      icon: type === 'config' ? 'settings' : undefined,
      content: await file.text(),
    };
  }

  return files;
}

export function createDefaultWorkspace() {
  const files = { ...INITIAL_WORKSPACE_FILES };
  return {
    projectName: 'web-ide',
    files,
    tree: buildTreeFromFiles(files),
    activeFileId: DEFAULT_ACTIVE_FILE_ID,
    openFileIds: [DEFAULT_ACTIVE_FILE_ID],
    source: 'default' as const,
  };
}

async function loadWorkspaceFromDirectoryPicker(): Promise<{
  projectName: string;
  files: Record<string, WorkspaceFile>;
  tree: TreeItem[];
  activeFileId: string;
  openFileIds: string[];
  source: 'folder';
}> {
  const handle = await window.showDirectoryPicker({ mode: 'read' });
  const files = await readDirectoryHandle(handle);
  const paths = Object.keys(files);

  if (paths.length === 0) {
    throw new Error('No supported text files were found in the selected folder.');
  }

  const activeFileId = paths.includes(DEFAULT_ACTIVE_FILE_ID)
    ? DEFAULT_ACTIVE_FILE_ID
    : paths[0];

  return {
    projectName: handle.name,
    files,
    tree: buildTreeFromFiles(files),
    activeFileId,
    openFileIds: [activeFileId],
    source: 'folder',
  };
}

export async function loadWorkspaceFromFolder(): Promise<{
  projectName: string;
  files: Record<string, WorkspaceFile>;
  tree: TreeItem[];
  activeFileId: string;
  openFileIds: string[];
  source: 'folder';
}> {
  if (supportsDirectoryPicker()) {
    return loadWorkspaceFromDirectoryPicker();
  }

  throw new Error('FALLBACK_FILE_INPUT');
}

export async function loadWorkspaceFromImportedFiles(
  fileList: FileList,
  projectName = 'imported-project',
) {
  return loadWorkspaceFromFileList(fileList, projectName);
}

export { supportsDirectoryPicker, supportsDirectoryUpload } from './browserSupport';
