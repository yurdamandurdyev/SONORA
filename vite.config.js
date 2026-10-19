import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        shop: resolve(import.meta.dirname, 'shop.html'),
        discover: resolve(import.meta.dirname, 'discover.html'),
        wishlist: resolve(import.meta.dirname, 'wishlist.html'),
        login: resolve(import.meta.dirname, 'login.html')
      }
    }
  }
});
