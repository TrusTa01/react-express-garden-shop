import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// VITE_BASE sets the public path, e.g. "/react-express-garden-shop/" for GitHub Pages. Default: "/".
function normalizeBase(value) {
  if (!value || value === '/') return '/';
  return `/${value.replace(/^\/+|\/+$/g, '')}/`;
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    base: normalizeBase(env.VITE_BASE),
    plugins: [react()],
    server: { port: 5173 },
    preview: { port: 5173 },
  };
});
