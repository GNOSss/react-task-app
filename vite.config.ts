import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

console.log(vanillaExtractPlugin); // 플러그인 확인

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
});
