import type { TreeItem } from '../../constants/ide';
import type { WorkspaceFile } from '../../types';
import { STORES, idbDelete, idbGet, idbSet } from './indexedDb';
import { LOCAL_KEYS, readLocalJson, writeLocalJson, writeLocalString } from './localStore';

export interface PersistedWorkspace {
  projectName: string;
  files: Record<string, WorkspaceFile>;
  tree: TreeItem[];
  activeFileId: string;
  openFileIds: string[];
  source: 'default' | 'local' | 'folder';
  updatedAt: number;
}

const WORKSPACE_KEY = 'current';

export async function loadWorkspace(): Promise<PersistedWorkspace | null> {
  const fromDb = await idbGet<PersistedWorkspace>(STORES.workspace, WORKSPACE_KEY);
  if (fromDb) return fromDb;

  const legacy = readLocalJson<PersistedWorkspace>(LOCAL_KEYS.workspaceMeta);
  if (legacy) {
    await saveWorkspace(legacy);
    return legacy;
  }

  return null;
}

export async function saveWorkspace(
  workspace: Omit<PersistedWorkspace, 'updatedAt'> & { updatedAt?: number },
): Promise<void> {
  const payload: PersistedWorkspace = {
    ...workspace,
    updatedAt: Date.now(),
  };

  await idbSet(STORES.workspace, WORKSPACE_KEY, payload);
  writeLocalString(LOCAL_KEYS.projectName, payload.projectName);
  writeLocalJson(LOCAL_KEYS.workspaceMeta, {
    projectName: payload.projectName,
    fileCount: Object.keys(payload.files).length,
    activeFileId: payload.activeFileId,
    source: payload.source,
    updatedAt: payload.updatedAt,
  });
}

export async function clearWorkspace(): Promise<void> {
  await idbDelete(STORES.workspace, WORKSPACE_KEY);
}
