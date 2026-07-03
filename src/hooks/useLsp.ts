import type { Monaco } from '@monaco-editor/react';
import type * as MonacoEditor from 'monaco-editor';
import { useCallback, useEffect, useRef, useState } from 'react';
import { collectDiagnostics } from '../lib/lsp/diagnostics';
import { defineNeonIdeTheme } from '../lib/lsp/monacoTheme';
import { syncOpenModels, syncTypeScriptWorkspace } from '../lib/lsp/workspaceSync';
import type { EditorDiagnostic, WorkspaceFile } from '../types';

interface UseLspOptions {
  files: Record<string, WorkspaceFile>;
  openFileIds: string[];
}

export function useLsp({ files, openFileIds }: UseLspOptions) {
  const monacoRef = useRef<Monaco | null>(null);
  const [diagnostics, setDiagnostics] = useState<EditorDiagnostic[]>([]);
  const [isReady, setIsReady] = useState(false);

  const refreshDiagnostics = useCallback(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;
    setDiagnostics(collectDiagnostics(monaco, files));
  }, [files]);

  const syncWorkspace = useCallback(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;

    syncTypeScriptWorkspace(monaco, files);
    syncOpenModels(monaco, files, openFileIds);
    refreshDiagnostics();
  }, [files, openFileIds, refreshDiagnostics]);

  const handleEditorMount = useCallback(
    (_editor: MonacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
      monacoRef.current = monaco;
      defineNeonIdeTheme(monaco);
      monaco.editor.setTheme('neon-ide');
      setIsReady(true);
      syncWorkspace();
    },
    [syncWorkspace],
  );

  useEffect(() => {
    if (!isReady) return;
    syncWorkspace();
  }, [isReady, syncWorkspace]);

  useEffect(() => {
    const monaco = monacoRef.current;
    if (!monaco) return;

    const disposable = monaco.editor.onDidChangeMarkers(() => {
      refreshDiagnostics();
    });

    return () => disposable.dispose();
  }, [isReady, refreshDiagnostics]);

  return {
    diagnostics,
    handleEditorMount,
  };
}
