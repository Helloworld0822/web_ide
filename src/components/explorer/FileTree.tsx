import { useEffect, useMemo, useState } from 'react';
import type { TreeItem } from '../../constants/ide';
import { Icon } from '../Icon';

function FileIcon({ type }: { type: TreeItem['type'] }) {
  if (type === 'config') {
    return <Icon name="settings" className="text-sm text-tertiary" />;
  }
  return <Icon name="description" className="text-sm text-on-surface-variant" />;
}

function collectFolderPaths(items: TreeItem[], parent = ''): string[] {
  const paths: string[] = [];

  for (const item of items) {
    if (item.type !== 'folder') continue;

    const path = parent ? `${parent}/${item.name}` : item.name;
    paths.push(path);
    if (item.children) {
      paths.push(...collectFolderPaths(item.children, path));
    }
  }

  return paths;
}

interface TreeNodeProps {
  item: TreeItem;
  folderPath: string;
  depth?: number;
  activeFileId: string;
  expandedFolders: Set<string>;
  onToggleFolder: (folderPath: string) => void;
  onFileSelect: (fileId: string) => void;
}

function TreeNode({
  item,
  folderPath,
  depth = 0,
  activeFileId,
  expandedFolders,
  onToggleFolder,
  onFileSelect,
}: TreeNodeProps) {
  const folderIconClass =
    item.folderColor === 'yellow' ? 'text-yellow-500' : 'text-blue-400';

  const isFolder = item.type === 'folder';
  const isFile = item.type === 'file' || item.type === 'config';
  const isActive = isFile && item.id === activeFileId;
  const isExpanded = isFolder && expandedFolders.has(folderPath);

  const handleClick = () => {
    if (isFolder) {
      onToggleFolder(folderPath);
      return;
    }

    if (isFile && item.id) {
      onFileSelect(item.id);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`file-explorer-item w-full text-left ${isActive ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 8 + 8}px` }}
      >
        {isFolder ? (
          <>
            <Icon
              name={isExpanded ? 'expand_more' : 'chevron_right'}
              className="text-sm text-on-surface-variant"
            />
            <Icon name="folder" className={`text-sm ${folderIconClass}`} />
          </>
        ) : (
          <>
            <span className="inline-block w-3.5 shrink-0" />
            <FileIcon type={item.type} />
          </>
        )}
        <span>{item.name}</span>
      </button>
      {isFolder && isExpanded && item.children?.map((child) => (
        <TreeNode
          key={child.id ?? `${folderPath}/${child.name}`}
          item={child}
          folderPath={child.type === 'folder' ? `${folderPath}/${child.name}` : folderPath}
          depth={depth + 1}
          activeFileId={activeFileId}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
          onFileSelect={onFileSelect}
        />
      ))}
    </>
  );
}

interface FileTreeProps {
  projectName: string;
  items: TreeItem[];
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
}

export function FileTree({ projectName, items, activeFileId, onFileSelect }: FileTreeProps) {
  const folderPaths = useMemo(() => collectFolderPaths(items), [items]);
  const [projectExpanded, setProjectExpanded] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(() => new Set(folderPaths));

  useEffect(() => {
    setExpandedFolders(new Set(folderPaths));
    setProjectExpanded(true);
  }, [folderPaths, projectName]);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => setProjectExpanded((prev) => !prev)}
        className="flex w-full items-center px-2 py-1 text-left text-body-sm font-bold uppercase text-on-surface"
      >
        <Icon
          name={projectExpanded ? 'expand_more' : 'chevron_right'}
          className="mr-1 text-sm"
        />
        <span>{projectName}</span>
      </button>
      {projectExpanded && (
        <div className="ml-2">
          {items.map((item) => (
            <TreeNode
              key={item.id ?? item.name}
              item={item}
              folderPath={item.name}
              activeFileId={activeFileId}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              onFileSelect={onFileSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}
