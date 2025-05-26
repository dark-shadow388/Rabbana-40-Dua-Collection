import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/Rabbana-40-Dua-Collection/',
  server: {
    port: 4000,
    host: true,
    strictPort: true,
  },
});
