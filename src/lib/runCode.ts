export function runCode(code: string): void {
  const lines = code.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // eslint-disable-next-line no-eval
    eval(trimmed);
  }
}
