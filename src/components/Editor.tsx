interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function Editor({ value, onChange }: EditorProps) {
  const lines = value.split('\n');

  return (
    <div className="scrollbar-thin relative flex min-h-0 flex-1 overflow-auto bg-canvas font-code-md">
      <div className="w-12 shrink-0 select-none border-r border-border bg-surface-container-lowest py-4 pr-3 text-right text-on-surface-variant/30">
        {lines.map((_, i) => (
          <div key={i} className="leading-relaxed">
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="min-h-full w-full resize-none bg-transparent p-4 font-code-md text-code-md leading-relaxed text-ink caret-primary outline-none placeholder:text-ink-muted"
        placeholder="// Start coding..."
      />
    </div>
  );
}
