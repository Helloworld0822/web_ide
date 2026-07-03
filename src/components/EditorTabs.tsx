import type { WorkspaceFile } from '../types';
import { Icon } from './Icon';

interface EditorTabsProps {
  openFiles: WorkspaceFile[];
  activeFileId: string;
  onTabSelect: (fileId: string) => void;
  onTabClose: (fileId: string) => void;
}

export function EditorTabs({
  openFiles,
  activeFileId,
  onTabSelect,
  onTabClose,
}: EditorTabsProps) {
  return (
    <div className="flex h-9 shrink-0 border-b border-border bg-surface-container-lowest">
      {openFiles.map((file) => {
        const isActive = file.id === activeFileId;

        return (
          <button
            key={file.id}
            type="button"
            onClick={() => onTabSelect(file.id)}
            className={`editor-tab ${isActive ? 'active' : ''}`}
          >
            <Icon
              name={file.icon ?? 'description'}
              className={`text-sm ${isActive ? 'text-primary' : ''}`}
            />
            <span className="font-medium">{file.name}</span>
            {isActive && openFiles.length > 1 && (
              <span
                role="button"
                tabIndex={0}
                onClick={(event) => {
                  event.stopPropagation();
                  onTabClose(file.id);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    event.stopPropagation();
                    onTabClose(file.id);
                  }
                }}
                className="rounded p-0.5 hover:bg-surface-container-high"
              >
                <Icon name="close" className="text-sm" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
