import type { TreeItem } from '../../constants/ide';
import { Icon } from '../Icon';

function FileIcon({ type }: { type: TreeItem['type'] }) {
  if (type === 'config') {
    return <Icon name="settings" className="text-sm text-tertiary" />;
  }
  return <Icon name="description" className="text-sm text-on-surface-variant" />;
}

interface TreeNodeProps {
  item: TreeItem;
  depth?: number;
  activeFileId: string;
  onFileSelect: (fileId: string) => void;
}

function TreeNode({ item, depth = 0, activeFileId, onFileSelect }: TreeNodeProps) {
  const folderIconClass =
    item.folderColor === 'yellow' ? 'text-yellow-500' : 'text-blue-400';

  const isFile = item.type === 'file' || item.type === 'config';
  const isActive = isFile && item.id === activeFileId;

  const handleClick = () => {
    if (isFile && item.id) {
      onFileSelect(item.id);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={!isFile}
        className={`file-explorer-item w-full text-left ${isActive ? 'active' : ''} ${
          !isFile ? 'cursor-default' : ''
        }`}
        style={{ paddingLeft: `${depth * 8 + 8}px` }}
      >
        {item.type === 'folder' ? (
          <Icon name="folder" className={`text-sm ${folderIconClass}`} />
        ) : (
          <FileIcon type={item.type} />
        )}
        <span>{item.name}</span>
      </button>
      {item.children?.map((child) => (
        <TreeNode
          key={child.id ?? child.name}
          item={child}
          depth={depth + 1}
          activeFileId={activeFileId}
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
  return (
    <div className="mb-4">
      <div className="flex items-center px-2 py-1 text-body-sm font-bold uppercase text-on-surface">
        <Icon name="expand_more" className="mr-1 text-sm" />
        <span>{projectName}</span>
      </div>
      <div className="ml-2">
        {items.map((item) => (
          <TreeNode
            key={item.id ?? item.name}
            item={item}
            activeFileId={activeFileId}
            onFileSelect={onFileSelect}
          />
        ))}
      </div>
    </div>
  );
}
