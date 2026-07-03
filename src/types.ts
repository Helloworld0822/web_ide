export interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'config';
  content: string;
  icon?: string;
}
