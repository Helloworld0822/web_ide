export interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface EditorDiagnostic {
  id: string;
  fileId: string;
  filePath: string;
  fileName: string;
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
  source?: string;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'config';
  content: string;
  icon?: string;
}
