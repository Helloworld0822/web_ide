export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

export interface EditorTab {
  id: string;
  label: string;
  active?: boolean;
  icon?: string;
}

export interface TreeItem {
  name: string;
  type: 'folder' | 'file' | 'config';
  active?: boolean;
  children?: TreeItem[];
  folderColor?: 'blue' | 'yellow';
}

export interface BranchItem {
  name: string;
  active?: boolean;
}

export const ACTIVITY_ITEMS: ActivityItem[] = [
  { id: 'explorer', icon: 'file_copy', label: 'Explorer', active: true },
  { id: 'search', icon: 'search', label: 'Search' },
  { id: 'git', icon: 'account_tree', label: 'Git' },
  { id: 'terminal', icon: 'terminal', label: 'Terminal' },
  { id: 'database', icon: 'database', label: 'Databases' },
];

export const EDITOR_TABS: EditorTab[] = [
  { id: 'main', label: 'main.js', active: true },
  { id: 'utils', label: 'utils.js' },
  { id: 'config', label: 'config.json', icon: 'settings' },
];

export const PROJECT_TREE: TreeItem[] = [
  {
    name: 'src',
    type: 'folder',
    folderColor: 'blue',
    children: [
      { name: 'main.js', type: 'file', active: true },
      { name: 'utils.js', type: 'file' },
    ],
  },
  {
    name: 'config',
    type: 'folder',
    folderColor: 'yellow',
    children: [{ name: 'config.json', type: 'config' }],
  },
];

export const BRANCHES: BranchItem[] = [
  { name: 'main', active: true },
  { name: 'feature/auth-fix' },
];

export const PANEL_TABS = ['TERMINAL', 'OUTPUT', 'DEBUG CONSOLE', 'PROBLEMS'] as const;

export const DEFAULT_CODE = `// Write JavaScript and click Run
console.log("Hello, Web IDE!");

const sum = (a, b) => a + b;
console.log("2 + 3 =", sum(2, 3));
`;
