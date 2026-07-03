import { loadWorkspace, type PersistedWorkspace } from '../storage/workspaceStore';
import { buildTreeFromFiles } from '../workspace/buildTree';

export async function loadWorkspaceFromBrowserStorage(): Promise<PersistedWorkspace | null> {
  const saved = await loadWorkspace();
  if (!saved) return null;

  return {
    ...saved,
    source: 'local',
    tree: saved.tree.length > 0 ? saved.tree : buildTreeFromFiles(saved.files),
  };
}
