import type { Monaco } from '@monaco-editor/react';
import type { WorkspaceFile } from '../../types';
import { getLanguageId, isTypeScriptLanguage } from './languages';

/** Matches @monaco-editor/react model paths (`monaco.Uri.parse(path)`). */
export function toModelPath(path: string): string {
  return path.replace(/^\/+/, '');
}

export function uriToPath(uri: string): string {
  return uri
    .replace(/^file:\/\//, '')
    .replace(/^inmemory:\/\//, '')
    .replace(/^\/+/, '');
}

function findFileByPath(
  files: Record<string, WorkspaceFile>,
  path: string,
): WorkspaceFile | undefined {
  const normalized = uriToPath(path);
  return Object.values(files).find(
    (file) => file.path === normalized || file.path === `/${normalized}`,
  );
}

export function syncTypeScriptWorkspace(
  monaco: Monaco,
  files: Record<string, WorkspaceFile>,
): void {
  const scriptFiles = Object.values(files).filter((file) =>
    isTypeScriptLanguage(getLanguageId(file.path)),
  );

  const extraLibs = scriptFiles.map((file) => ({
    content: file.content,
    filePath: toModelPath(file.path),
  }));

  const compilerOptions = {
    target: monaco.languages.typescript.ScriptTarget.ES2020,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.ESNext,
    jsx: monaco.languages.typescript.JsxEmit.React,
    esModuleInterop: true,
    noEmit: true,
    allowJs: true,
    checkJs: true,
    strict: false,
  };

  monaco.languages.typescript.typescriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions(compilerOptions);
  monaco.languages.typescript.typescriptDefaults.setExtraLibs(extraLibs);
  monaco.languages.typescript.javascriptDefaults.setExtraLibs(extraLibs);
}

export function findFileIdByPath(
  files: Record<string, WorkspaceFile>,
  path: string,
): string | undefined {
  return findFileByPath(files, path)?.id;
}
