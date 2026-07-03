import { useEffect, useRef, useState } from 'react';
import type { V86 } from 'v86';
import { ALPINE_ISO, ALPINE_VM_CONFIG, VM_NETWORK_CONFIG } from '../constants/vm';
import { prepareVmAssets, releaseVmAssetUrls } from '../lib/vm/prepareVmAssets';

export type VmStatus = 'idle' | 'loading' | 'ready' | 'error';

export function useAlpineVm(enabled: boolean) {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const emulatorRef = useRef<V86 | null>(null);
  const [status, setStatus] = useState<VmStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('Alpine VM is idle');

  useEffect(() => {
    if (!enabled) return;

    const terminalContainer = terminalContainerRef.current;
    const screenContainer = screenContainerRef.current;
    if (!terminalContainer || !screenContainer) return;

    let disposed = false;
    let assetUrls: Awaited<ReturnType<typeof prepareVmAssets>> | null = null;

    const handleReady = () => {
      if (disposed) return;
      setStatus('ready');
      setStatusMessage('Alpine is running · cached locally · Internet via fetch relay');
      terminalContainer.querySelector<HTMLElement>('.xterm-helper-textarea')?.focus();
    };

    const handleDownloadError = () => {
      if (disposed) return;
      setStatus('error');
      setStatusMessage('Failed to download Alpine VM assets');
    };

    setStatus('loading');
    setStatusMessage('Loading VM libraries from local cache...');

    void (async () => {
      try {
        const [{ V86: V86Constructor }, { Terminal: XTerm }] = await Promise.all([
          import('v86'),
          import('@xterm/xterm'),
        ]);

        if (disposed) return;

        assetUrls = await prepareVmAssets((message) => {
          if (!disposed) setStatusMessage(message);
        });

        if (disposed) return;

        const emulator = new V86Constructor({
          wasm_path: assetUrls.wasmPath,
          memory_size: ALPINE_VM_CONFIG.memorySize,
          vga_memory_size: ALPINE_VM_CONFIG.vgaMemorySize,
          screen: { container: screenContainer },
          bios: { url: assetUrls.biosUrl },
          vga_bios: { url: assetUrls.vgaBiosUrl },
          cdrom: {
            ...ALPINE_ISO,
            url: assetUrls.cdromUrl,
          },
          boot_order: 0x213,
          autostart: true,
          cmdline: ALPINE_VM_CONFIG.cmdline,
          virtio_console: {
            type: 'xtermjs',
            container: terminalContainer,
            xterm_lib: XTerm,
          },
          net_device: VM_NETWORK_CONFIG,
          disable_keyboard: false,
          disable_mouse: true,
        });

        emulatorRef.current = emulator;
        emulator.add_listener('emulator-ready', handleReady);
        emulator.add_listener('download-error', handleDownloadError);
      } catch (error) {
        if (!disposed) {
          setStatus('error');
          const detail = error instanceof Error ? error.message : 'Unknown error';
          setStatusMessage(`Failed to start Alpine VM: ${detail}`);
        }
      }
    })();

    return () => {
      disposed = true;
      const emulator = emulatorRef.current;
      if (emulator) {
        emulator.remove_listener('emulator-ready', handleReady);
        emulator.remove_listener('download-error', handleDownloadError);
        void emulator.destroy();
        emulatorRef.current = null;
      }
      if (assetUrls) {
        releaseVmAssetUrls(assetUrls);
      }
      terminalContainer.replaceChildren();
      setStatus('idle');
      setStatusMessage('Alpine VM stopped');
    };
  }, [enabled]);

  return {
    terminalContainerRef,
    screenContainerRef,
    status,
    statusMessage,
  };
}
