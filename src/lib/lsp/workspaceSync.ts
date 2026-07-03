import type { Monaco } from '@monaco-editor/react';
import type { WorkspaceFile } from '../../types';
import { getLanguageId, isTypeScriptLanguage } from './languages';

export function toFileUri(path: string): string {
  const normalized = path.replace(/^\/+/, '');
  return `file:///${normalized}`;
}

export function uriToPath(uri: string): string {
  return uri.replace(/^file:\/\//, '').replace(/^\/+/, '');
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
    filePath: toFileUri(file.path),
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

export function syncOpenModels(
  monaco: Monaco,
  files: Record<string, WorkspaceFile>,
  openFileIds: string[],
): void {
  const openIdSet = new Set(openFileIds);

  for (const model of monaco.editor.getModels()) {
    const path = uriToPath(model.uri.toString());
    const file = findFileByPath(files, path);
    if (!file || !openIdSet.has(file.id)) {
      model.dispose();
    }
  }

  for (const fileId of openFileIds) {
    const file = files[fileId];
    if (!file) continue;

    const uri = monaco.Uri.parse(toFileUri(file.path));
    const language = getLanguageId(file.path);
    const existing = monaco.editor.getModel(uri);

    if (existing) {
      if (existing.getValue() !== file.content) {
        existing.setValue(file.content);
      }
      if (existing.getLanguageId() !== language) {
        monaco.editor.setModelLanguage(existing, language);
      }
      continue;
    }

    monaco.editor.createModel(file.content, language, uri);
  }
}

export function findFileIdByPath(
  files: Record<string, WorkspaceFile>,
  path: string,
): string | undefined {
  return findFileByPath(files, path)?.id;
}
