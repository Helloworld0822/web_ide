import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const repositoryName = 'web_ide';
const pagesBase = `/${repositoryName}/`;

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? pagesBase : '/',
  plugins: [react(), tailwindcss()],
}));
