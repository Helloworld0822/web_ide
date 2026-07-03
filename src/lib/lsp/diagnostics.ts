import type { Monaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { MarkerSeverity } from 'monaco-editor';
import type { EditorDiagnostic, WorkspaceFile } from '../../types';
import { findFileIdByPath, uriToPath } from './workspaceSync';

function severityLabel(severity: MarkerSeverity): EditorDiagnostic['severity'] {
  if (severity === MarkerSeverity.Error) return 'error';
  if (severity === MarkerSeverity.Warning) return 'warning';
  return 'info';
}

export function collectDiagnostics(
  monaco: Monaco,
  files: Record<string, WorkspaceFile>,
): EditorDiagnostic[] {
  const markers = monaco.editor.getModelMarkers({});

  return markers
    .map((marker: editor.IMarker) => {
      const filePath = uriToPath(marker.resource.toString());
      const fileId = findFileIdByPath(files, filePath);
      if (!fileId) return null;

      const file = files[fileId];
      return {
        id: `${fileId}:${marker.startLineNumber}:${marker.startColumn}:${marker.message}`,
        fileId,
        filePath: file.path,
        fileName: file.name,
        line: marker.startLineNumber,
        column: marker.startColumn,
        message: marker.message,
        severity: severityLabel(marker.severity),
        source: marker.source,
      } satisfies EditorDiagnostic;
    })
    .filter((item: EditorDiagnostic | null): item is EditorDiagnostic => item !== null)
    .sort((a: EditorDiagnostic, b: EditorDiagnostic) => {
      if (a.filePath !== b.filePath) return a.filePath.localeCompare(b.filePath);
      if (a.line !== b.line) return a.line - b.line;
      return a.column - b.column;
    });
}
