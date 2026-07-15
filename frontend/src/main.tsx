import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// ── Theme migration: remove old .light class, clear stale dark persisted state ──
try {
  const stored = localStorage.getItem('nexusflow-theme');
  if (stored) {
    const parsed = JSON.parse(stored);
    // Migrate: if old persisted theme was 'dark', keep it; if 'light' or missing, ensure light
    if (parsed?.state?.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('light'); // remove old class name
    }
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.remove('light');
  }
} catch { /* ignore */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
