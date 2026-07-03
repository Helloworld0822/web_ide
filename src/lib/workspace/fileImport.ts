import type { TreeItem } from '../../constants/ide';
import { DEFAULT_ACTIVE_FILE_ID } from '../../constants/ide';
import type { WorkspaceFile } from '../../types';
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

function normalizePath(path: string): string {
  return path.replace(/^\.?\//, '').replace(/\\/g, '/');
}

export function parseFilesFromFileList(fileList: FileList): Record<string, WorkspaceFile> {
  const files: Record<string, WorkspaceFile> = {};

  for (const file of fileList) {
    if (file.size > MAX_FILE_SIZE) continue;

    const rawPath = file.webkitRelativePath || file.name;
    const path = normalizePath(rawPath);
    const name = path.split('/').pop() ?? path;

    const dotIndex = name.lastIndexOf('.');
    const ext = dotIndex >= 0 ? name.slice(dotIndex).toLowerCase() : '';
    if (ext && !TEXT_EXTENSIONS.has(ext)) continue;

    const type = guessFileType(name);
    // Content is read asynchronously by caller
    files[path] = {
      id: path,
      name,
      path,
      type,
      icon: type === 'config' ? 'settings' : undefined,
      content: '',
    };
  }

  return files;
}

export async function readFileListContents(
  fileList: FileList,
  fileMap: Record<string, WorkspaceFile>,
): Promise<Record<string, WorkspaceFile>> {
  const result: Record<string, WorkspaceFile> = {};

  for (const file of fileList) {
    const rawPath = file.webkitRelativePath || file.name;
    const path = normalizePath(rawPath);
    const entry = fileMap[path];
    if (!entry) continue;

    result[path] = {
      ...entry,
      content: await file.text(),
    };
  }

  return result;
}

export function buildWorkspaceFromFiles(
  files: Record<string, WorkspaceFile>,
  projectName: string,
  source: 'folder' | 'local',
) {
  const paths = Object.keys(files);
  const activeFileId = paths.includes(DEFAULT_ACTIVE_FILE_ID)
    ? DEFAULT_ACTIVE_FILE_ID
    : paths[0];

  return {
    projectName,
    files,
    tree: buildTreeFromFiles(files) as TreeItem[],
    activeFileId,
    openFileIds: [activeFileId],
    source,
  };
}

export async function loadWorkspaceFromFileList(
  fileList: FileList,
  projectName: string,
): Promise<ReturnType<typeof buildWorkspaceFromFiles>> {
  const fileMap = parseFilesFromFileList(fileList);
  const paths = Object.keys(fileMap);

  if (paths.length === 0) {
    throw new Error('No supported text files were found in the selection.');
  }

  const files = await readFileListContents(fileList, fileMap);
  return buildWorkspaceFromFiles(files, projectName, 'folder');
}
