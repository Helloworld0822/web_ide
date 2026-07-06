import MonacoEditor from '@monaco-editor/react';
import type * as MonacoEditorTypes from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { useEffect, useRef } from 'react';
import { getLanguageId } from '../lib/lsp/languages';
import type { WorkspaceFile } from '../types';

interface EditorProps {
  activeFile: WorkspaceFile;
  onChange: (value: string) => void;
  onMount: (
    editor: MonacoEditorTypes.editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => void;
  pendingReveal?: { line: number; column: number } | null;
  onRevealComplete?: () => void;
}

const EDITOR_FONT =
  '"JetBrains Mono", "Noto Sans KR", "Malgun Gothic", "Apple SD Gothic Neo", ui-monospace, monospace';

export function Editor({
  activeFile,
  onChange,
  onMount,
  pendingReveal,
  onRevealComplete,
}: EditorProps) {
  const editorRef = useRef<MonacoEditorTypes.editor.IStandaloneCodeEditor | null>(null);
  const isComposingRef = useRef(false);

  useEffect(() => {
    if (!pendingReveal || !editorRef.current) return;

    editorRef.current.revealLineInCenter(pendingReveal.line);
    editorRef.current.setPosition({
      lineNumber: pendingReveal.line,
      column: pendingReveal.column,
    });
    editorRef.current.focus();
    onRevealComplete?.();
  }, [pendingReveal, activeFile.id, onRevealComplete]);

  return (
    <div className="monaco-editor-container min-h-0 flex-1">
      <MonacoEditor
        height="100%"
        key={activeFile.id}
        path={activeFile.path}
        language={getLanguageId(activeFile.path)}
        defaultValue={activeFile.content}
        theme="neon-ide"
        onChange={(value) => {
          if (isComposingRef.current) return;
          onChange(value ?? '');
        }}
        onMount={(editor, monaco) => {
          editorRef.current = editor;
          const textarea = editor.getContainerDomNode().querySelector('textarea');
          if (textarea) {
            textarea.addEventListener('compositionstart', () => {
              isComposingRef.current = true;
            });
            textarea.addEventListener('compositionend', () => {
              isComposingRef.current = false;
              onChange(editor.getValue());
            });
          }
          onMount(editor, monaco);
        }}
        options={{
          fontFamily: EDITOR_FONT,
          fontSize: 12,
          lineHeight: 18,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'line',
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
          formatOnPaste: true,
          bracketPairColorization: { enabled: true },
        }}
      />
    </div>
  );
}
