import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/Rabbana-40-Dua-Collection/', // Add this line - must match your repository name
  server: {
    port: 4000, // Changed to port 4000
    host: true,
    strictPort: true,
  },
});
