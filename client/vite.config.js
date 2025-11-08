// client/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Direktori output untuk build produksi
  },
  server: {
    open: true, // Otomatis membuka browser saat dev server dimulai
    port: 5173, // Pastikan menggunakan port yang konsisten
  },
  // Konfigurasi fallback untuk SPA
  // Ini penting untuk deployment agar server selalu menyajikan index.html untuk rute yang tidak dikenal
  // Untuk dev server, Vite biasanya sudah mengurus ini secara default.
  // Tapi untuk berjaga-jaga jika ada isu dengan mode history React Router.
  // Jika Anda deploy ke sub-path (misal: example.com/klinik/), Anda perlu base: '/klinik/'
  // base: '/', // uncomment and set if you have a base path
});