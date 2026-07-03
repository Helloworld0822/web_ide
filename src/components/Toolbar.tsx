import { Icon } from './Icon';

interface ToolbarProps {
  onRun: () => void;
  isRunning?: boolean;
}

export function Toolbar({ onRun, isRunning }: ToolbarProps) {
  return (
    <header className="z-30 flex h-12 shrink-0 items-center justify-between border-b border-border bg-canvas px-4">
      <div className="flex items-center gap-2 text-body-sm text-on-surface-variant">
        <span className="font-bold text-primary">Neon</span>
        <span>/</span>
        <span>web-ide</span>
        <span>/</span>
        <span className="text-on-surface">main.js</span>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onRun}
          disabled={isRunning}
          className="flex items-center gap-1 rounded-sm bg-primary px-3 py-1 text-body-sm font-bold text-on-primary transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-50"
        >
          <Icon name="play_arrow" className="text-base" filled />
          Run
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <div className="flex gap-4 text-on-surface-variant">
          <Icon name="cloud_upload" className="cursor-pointer text-xl hover:text-on-surface" />
          <Icon name="share" className="cursor-pointer text-xl hover:text-on-surface" />
        </div>
      </div>
    </header>
  );
}
