import type { TreeItem } from '../../constants/ide';
import { Icon } from '../Icon';

function FileIcon({ type }: { type: TreeItem['type'] }) {
  if (type === 'config') {
    return <Icon name="settings" className="text-sm text-tertiary" />;
  }
  return <Icon name="description" className="text-sm text-on-surface-variant" />;
}

function TreeNode({ item, depth = 0 }: { item: TreeItem; depth?: number }) {
  const folderIconClass =
    item.folderColor === 'yellow' ? 'text-yellow-500' : 'text-blue-400';

  return (
    <>
      <div
        className={`file-explorer-item ${item.active ? 'active' : ''}`}
        style={{ paddingLeft: `${depth * 8 + 8}px` }}
      >
        {item.type === 'folder' ? (
          <Icon name="folder" className={`text-sm ${folderIconClass}`} />
        ) : (
          <FileIcon type={item.type} />
        )}
        <span>{item.name}</span>
      </div>
      {item.children?.map((child) => (
        <TreeNode key={child.name} item={child} depth={depth + 1} />
      ))}
    </>
  );
}

interface FileTreeProps {
  projectName: string;
  items: TreeItem[];
}

export function FileTree({ projectName, items }: FileTreeProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center px-2 py-1 text-body-sm font-bold uppercase text-on-surface">
        <Icon name="expand_more" className="mr-1 text-sm" />
        <span>{projectName}</span>
      </div>
      <div className="ml-2">
        {items.map((item) => (
          <TreeNode key={item.name} item={item} />
        ))}
      </div>
    </div>
  );
}
