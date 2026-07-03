import '@xterm/xterm/css/xterm.css';
import type { RefObject } from 'react';
import type { VmStatus } from '../../hooks/useAlpineVm';

interface AlpineTerminalProps {
  enabled: boolean;
  status: VmStatus;
  statusMessage: string;
  terminalContainerRef: RefObject<HTMLDivElement | null>;
  screenContainerRef: RefObject<HTMLDivElement | null>;
}

export function AlpineTerminal({
  enabled,
  status,
  statusMessage,
  terminalContainerRef,
  screenContainerRef,
}: AlpineTerminalProps) {
  if (!enabled) {
    return (
      <p className="p-3 text-on-surface-variant">
        Open the Terminal tab to boot Alpine Linux in WebAssembly.
      </p>
    );
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
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
