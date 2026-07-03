export interface ActivityItem {
  id: string;
  icon: string;
  label: string;
  active?: boolean;
}

export interface TreeItem {
  id?: string;
  name: string;
  type: 'folder' | 'file' | 'config';
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

export const PROJECT_TREE: TreeItem[] = [
  {
    name: 'src',
    type: 'folder',
    folderColor: 'blue',
    children: [
      { id: 'src/main.js', name: 'main.js', type: 'file' },
      { id: 'src/utils.js', name: 'utils.js', type: 'file' },
    ],
  },
  {
    name: 'config',
    type: 'folder',
    folderColor: 'yellow',
    children: [{ id: 'config/config.json', name: 'config.json', type: 'config' }],
  },
];

export const BRANCHES: BranchItem[] = [
  { name: 'main', active: true },
  { name: 'feature/auth-fix' },
];

export const PANEL_TABS = ['TERMINAL', 'OUTPUT', 'DEBUG CONSOLE', 'PROBLEMS'] as const;

export const INITIAL_WORKSPACE_FILES = {
  'src/main.js': {
    id: 'src/main.js',
    name: 'main.js',
    path: 'src/main.js',
    type: 'file' as const,
    content: `// Write JavaScript and click Run
console.log("Hello, Web IDE!");

const sum = (a, b) => a + b;
console.log("2 + 3 =", sum(2, 3));
`,
  },
  'src/utils.js': {
    id: 'src/utils.js',
    name: 'utils.js',
    path: 'src/utils.js',
    type: 'file' as const,
    content: `// Utility helpers
function greet(name) {
  return "Hello, " + name + "!";
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

console.log(greet("Web IDE"));
console.log("clamp(12, 0, 10) =", clamp(12, 0, 10));
`,
  },
  'config/config.json': {
    id: 'config/config.json',
    name: 'config.json',
    path: 'config/config.json',
    type: 'config' as const,
    icon: 'settings',
    content: `{
  "name": "web-ide",
  "version": "1.0.0",
  "runtime": "browser"
}
`,
  },
};

export const DEFAULT_ACTIVE_FILE_ID = 'src/main.js';
