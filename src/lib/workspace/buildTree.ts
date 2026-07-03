import type { TreeItem } from '../../constants/ide';
import type { WorkspaceFile } from '../../types';

export function buildTreeFromFiles(files: Record<string, WorkspaceFile>): TreeItem[] {
  const root: TreeItem[] = [];
  const folderMap = new Map<string, TreeItem>();

  for (const path of Object.keys(files).sort()) {
    const file = files[path];
    const parts = path.split('/');
    const fileName = parts.pop();
    if (!fileName) continue;

    let siblings = root;
    let currentPath = '';

    for (const part of parts) {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      let folder = folderMap.get(currentPath);
      if (!folder) {
        folder = {
          name: part,
          type: 'folder',
          folderColor: part === 'config' ? 'yellow' : 'blue',
          children: [],
        };
        folderMap.set(currentPath, folder);
        siblings.push(folder);
      }
      siblings = folder.children!;
    }

    siblings.push({
      id: file.id,
      name: fileName,
      type: file.type,
    });
  }

  return root;
}
