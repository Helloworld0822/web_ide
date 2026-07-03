import type { Monaco } from '@monaco-editor/react';

export function defineNeonIdeTheme(monaco: Monaco): void {
  monaco.editor.defineTheme('neon-ide', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6a7a6e', fontStyle: 'italic' },
      { token: 'keyword', foreground: '6dffba' },
      { token: 'string', foreground: 'ffe0bc' },
      { token: 'number', foreground: '8be9fd' },
      { token: 'type', foreground: '6dffba' },
      { token: 'function', foreground: 'dbe5dc' },
    ],
    colors: {
      'editor.background': '#0e0e0e',
      'editor.foreground': '#ededed',
      'editorCursor.foreground': '#6dffba',
      'editor.lineHighlightBackground': '#151d18',
      'editor.selectionBackground': '#6dffba33',
      'editor.inactiveSelectionBackground': '#6dffba1a',
      'editorLineNumber.foreground': '#77777755',
      'editorLineNumber.activeForeground': '#6dffba',
      'editorIndentGuide.background': '#2a2a2a',
      'editorIndentGuide.activeBackground': '#3b4a41',
      'editorWidget.background': '#151d18',
      'editorWidget.border': '#2a2a2a',
      'editorSuggestWidget.background': '#151d18',
      'editorSuggestWidget.border': '#2a2a2a',
      'editorSuggestWidget.selectedBackground': '#19221c',
      'editorHoverWidget.background': '#151d18',
      'editorHoverWidget.border': '#2a2a2a',
      'scrollbarSlider.background': '#3b4a4180',
      'scrollbarSlider.hoverBackground': '#3b4a41cc',
      'minimap.background': '#0e0e0e',
    },
  });
}
