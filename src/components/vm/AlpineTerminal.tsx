import '@xterm/xterm/css/xterm.css';
import type { RefObject } from 'react';
import type { VmStatus } from '../../hooks/useAlpineVm';

interface AlpineTerminalProps {
  status: VmStatus;
  statusMessage: string;
  terminalContainerRef: RefObject<HTMLDivElement | null>;
  screenContainerRef: RefObject<HTMLDivElement | null>;
}

export function AlpineTerminal({
  status,
  statusMessage,
  terminalContainerRef,
  screenContainerRef,
}: AlpineTerminalProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-1.5 text-body-sm">
        <div className="flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${
              status === 'ready'
                ? 'bg-primary'
                : status === 'error'
                  ? 'bg-danger'
                  : 'animate-pulse bg-tertiary'
            }`}
          />
          <span className="text-on-surface-variant">{statusMessage}</span>
        </div>
        <span className="text-label-caps text-on-surface-variant/70">Alpine · v86 · WASM</span>
      </div>

      <div className="alpine-terminal relative min-h-0 flex-1 p-1">
        <div ref={terminalContainerRef} className="h-full w-full" />
        <div
          ref={screenContainerRef}
          aria-hidden
          className="pointer-events-none absolute size-px overflow-hidden opacity-0"
        />
      </div>
    </div>
  );
}
