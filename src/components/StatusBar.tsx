import { Icon } from './Icon';

interface StatusBarProps {
  languageLabel: string;
}

export function StatusBar({ languageLabel }: StatusBarProps) {
  return (
    <footer className="z-30 flex h-6 shrink-0 select-none items-center justify-between bg-primary px-3 text-[10px] font-bold text-on-primary">
      <div className="flex items-center gap-4">
        <div className="flex h-full cursor-pointer items-center gap-1 px-2 hover:bg-on-primary/10">
          <Icon name="account_tree" className="text-[14px]" />
          <span>main*</span>
        </div>
        <div className="flex h-full cursor-pointer items-center gap-1 px-2 hover:bg-on-primary/10">
          <Icon name="sync" className="text-[14px]" />
          <span>Synchronized</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-full cursor-pointer items-center px-2 hover:bg-on-primary/10">
          Spaces: 2
        </div>
        <div className="flex h-full cursor-pointer items-center px-2 hover:bg-on-primary/10">
          UTF-8
        </div>
        <div className="flex h-full cursor-pointer items-center px-2 hover:bg-on-primary/10">
          {languageLabel}
        </div>
        <div className="flex h-full cursor-pointer items-center gap-1 px-2 hover:bg-on-primary/10">
          <Icon name="notifications" className="text-[14px]" />
        </div>
      </div>
    </footer>
  );
}
