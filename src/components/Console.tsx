import { useEffect, useRef, useState } from 'react';
import { PANEL_TABS } from '../constants/ide';
import { useAlpineVm } from '../hooks/useAlpineVm';
import type { LogEntry } from '../types';
import { AlpineTerminal } from './vm/AlpineTerminal';
import { Icon } from './Icon';

interface ConsoleProps {
  logs: LogEntry[];
  onClear: () => void;
}

export function Console({ logs, onClear }: ConsoleProps) {
  const [activeTab, setActiveTab] = useState<(typeof PANEL_TABS)[number]>('OUTPUT');
  const [vmEnabled, setVmEnabled] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { terminalContainerRef, screenContainerRef, status, statusMessage } =
    useAlpineVm(vmEnabled);

  useEffect(() => {
    if (activeTab === 'TERMINAL') {
      setVmEnabled(true);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'OUTPUT') return;
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, activeTab]);

  const isTerminalTab = activeTab === 'TERMINAL';
  const panelHeight = isTerminalTab ? 'h-80' : 'h-48';

  return (
    <div
      className={`flex ${panelHeight} shrink-0 flex-col border-t border-border bg-surface-container-lowest transition-[height] duration-200`}
    >
      <div className="flex h-8 shrink-0 items-center border-b border-border bg-canvas px-4">
        <div className="flex h-full items-center gap-6">
          {PANEL_TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`panel-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
              {tab === 'PROBLEMS' && (
                <span className="ml-2 rounded-full bg-on-surface-variant/20 px-1.5 text-[9px] font-bold">
                  0
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3 text-on-surface-variant">
          {activeTab === 'OUTPUT' && (
            <button type="button" onClick={onClear} className="text-label-caps hover:text-on-surface">
              Clear
            </button>
          )}
          <Icon name="close_fullscreen" className="cursor-pointer text-sm" />
          <Icon name="close" className="cursor-pointer text-sm" />
        </div>
      </div>

      {isTerminalTab ? (
        <AlpineTerminal
          enabled={vmEnabled}
          status={status}
          statusMessage={statusMessage}
          terminalContainerRef={terminalContainerRef}
          screenContainerRef={screenContainerRef}
        />
      ) : activeTab === 'OUTPUT' ? (
        <div className="scrollbar-thin flex-1 overflow-auto p-3 font-code-md text-code-md">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-primary">➜</span>
            <span className="text-on-surface">web-ide</span>
            <span className="text-on-surface-variant">
              git:(<span className="text-primary">main</span>)
            </span>
            <span className="bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">js runner</span>
          </div>

          {logs.length === 0 ? (
            <p className="text-on-surface-variant">
              JavaScript output appears here when you click Run.
              <span className="ml-1 animate-pulse text-primary">_</span>
            </p>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className={`py-0.5 ${log.type === 'error' ? 'text-danger' : 'text-on-surface-variant'}`}
              >
                <span className="text-on-surface-variant/60">
                  [{log.timestamp.toLocaleTimeString('en-US', { hour12: false })}]{' '}
                </span>
                <span className="whitespace-pre-wrap break-all">{log.message}</span>
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center p-4 text-body-sm text-on-surface-variant">
          {activeTab} panel is not available yet.
        </div>
      )}
    </div>
  );
}
