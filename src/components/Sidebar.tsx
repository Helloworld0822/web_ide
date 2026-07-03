import { BRANCHES, PROJECT_TREE } from '../constants/ide';
import { BranchesList } from './explorer/BranchesList';
import { FileTree } from './explorer/FileTree';
import { Icon } from './Icon';

export function Sidebar() {
  return (
    <aside className="z-40 flex h-full w-80 shrink-0 flex-col border-r border-border bg-surface-container-lowest">
      <div className="flex h-9 items-center justify-between border-b border-border bg-canvas px-4">
        <span className="text-label-caps font-bold tracking-wider text-on-surface-variant uppercase">
          Explorer
        </span>
        <Icon name="more_horiz" className="cursor-pointer text-sm text-on-surface-variant" />
      </div>

      <div className="scrollbar-thin flex-1 overflow-y-auto py-2">
        <FileTree projectName="web-ide" items={PROJECT_TREE} />
        <BranchesList branches={BRANCHES} />
      </div>
    </aside>
  );
}
