import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), ''), ...process.env };
  const origin = env.VITE_SITE_ORIGIN || 'https://homologacao.example.invalid';
  const parsed = new URL(origin);
  if (parsed.origin !== origin || !['https:', 'http:'].includes(parsed.protocol)) throw new Error('VITE_SITE_ORIGIN must be an origin without trailing slash');
  process.env.VITE_SITE_ORIGIN = origin;
  return {
    plugins: [react()],
    resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
    server: { proxy: { '/api': 'http://127.0.0.1:8080' } },
  };
});
