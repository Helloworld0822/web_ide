import { ACTIVITY_ITEMS } from '../constants/ide';
import { Icon } from './Icon';

export function ActivityBar() {
  return (
    <aside className="z-50 flex h-full w-12 shrink-0 flex-col items-center border-r border-border bg-surface-container-lowest py-4">
      <div className="mb-8">
        <Icon name="bolt" className="text-2xl font-black text-primary" filled />
      </div>

      {ACTIVITY_ITEMS.map((item) => (
        <div
          key={item.id}
          className={`activity-bar-item ${item.active ? 'active' : ''}`}
          title={item.label}
        >
          <Icon name={item.icon} className="text-xl" />
        </div>
      ))}

      <div className="mt-auto space-y-4">
        <div className="activity-bar-item" title="Settings">
          <Icon name="settings" className="text-xl" />
        </div>
        <div className="activity-bar-item" title="Account">
          <div className="flex size-6 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-container-high">
            <Icon name="person" className="text-sm text-on-surface-variant" />
          </div>
        </div>
      </div>
    </aside>
  );
}
