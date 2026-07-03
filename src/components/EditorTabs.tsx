import { EDITOR_TABS } from '../constants/ide';
import { Icon } from './Icon';

export function EditorTabs() {
  return (
    <div className="flex h-9 shrink-0 border-b border-border bg-surface-container-lowest">
      {EDITOR_TABS.map((tab) => (
        <div key={tab.id} className={`editor-tab ${tab.active ? 'active' : ''}`}>
          <Icon
            name={tab.icon ?? 'description'}
            className={`text-sm ${tab.active ? 'text-primary' : ''}`}
          />
          <span className="font-medium">{tab.label}</span>
          {tab.active && (
            <Icon
              name="close"
              className="rounded p-0.5 text-sm hover:bg-surface-container-high"
            />
          )}
        </div>
      ))}
    </div>
  );
}
