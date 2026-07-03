import type { EditorDiagnostic } from '../types';
import { Icon } from './Icon';

interface ProblemsPanelProps {
  diagnostics: EditorDiagnostic[];
  onSelect: (diagnostic: EditorDiagnostic) => void;
}

export function ProblemsPanel({ diagnostics, onSelect }: ProblemsPanelProps) {
  if (diagnostics.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-body-sm text-on-surface-variant">
        No problems detected in the workspace.
      </div>
    );
  }

  return (
    <div className="scrollbar-thin flex-1 overflow-auto font-code-md text-code-md">
      {diagnostics.map((diagnostic) => (
        <button
          key={diagnostic.id}
          type="button"
          onClick={() => onSelect(diagnostic)}
          className="flex w-full items-start gap-3 border-b border-border/40 px-3 py-2 text-left transition-colors hover:bg-surface-container-low"
        >
          <Icon
            name={
              diagnostic.severity === 'error'
                ? 'error'
                : diagnostic.severity === 'warning'
                  ? 'warning'
                  : 'info'
            }
            className={`mt-0.5 shrink-0 text-sm ${
              diagnostic.severity === 'error'
                ? 'text-danger'
                : diagnostic.severity === 'warning'
                  ? 'text-tertiary'
                  : 'text-on-surface-variant'
            }`}
          />
          <div className="min-w-0 flex-1">
            <p
              className={`truncate ${
                diagnostic.severity === 'error' ? 'text-danger' : 'text-on-surface'
              }`}
            >
              {diagnostic.message}
            </p>
            <p className="truncate text-on-surface-variant/70">
              {diagnostic.fileName}:{diagnostic.line}:{diagnostic.column}
              {diagnostic.source ? ` · ${diagnostic.source}` : ''}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
