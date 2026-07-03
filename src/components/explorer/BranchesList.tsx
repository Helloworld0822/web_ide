import type { BranchItem } from '../../constants/ide';
import { Icon } from '../Icon';

interface BranchesListProps {
  branches: BranchItem[];
}

export function BranchesList({ branches }: BranchesListProps) {
  return (
    <div>
      <div className="flex items-center px-2 py-1 text-body-sm font-bold uppercase text-on-surface">
        <Icon name="expand_more" className="mr-1 text-sm" />
        <span>Branches</span>
      </div>
      <div className="ml-2">
        {branches.map((branch) => (
          <div key={branch.name} className="file-explorer-item">
            <Icon
              name={branch.active ? 'radio_button_checked' : 'radio_button_unchecked'}
              className={`text-sm ${branch.active ? 'text-primary' : ''}`}
            />
            <span className={branch.active ? 'font-bold text-primary' : ''}>
              {branch.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
