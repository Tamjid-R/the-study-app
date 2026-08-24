import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Using a relative base ('./') so the built assets resolve correctly
// whether the app is hosted at the domain root or under a GitHub Pages
// project path like https://<user>.github.io/<repo>/.
export default defineConfig({
  plugins: [react()],
  base: './',
});
