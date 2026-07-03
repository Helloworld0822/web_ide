export interface LogEntry {
  id: number;
  type: 'log' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

export interface FileItem {
  id: string;
  name: string;
  active?: boolean;
}
