import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { configureMonacoEnvironment } from './lib/lsp/monacoEnv';

configureMonacoEnvironment();
import '@xterm/xterm/css/xterm.css';

if ('serviceWorker' in navigator) {
  void navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
    // Service worker is optional; IndexedDB cache still works.
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
