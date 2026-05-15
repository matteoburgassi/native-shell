import { defineConfig } from 'tsup';
import { resolve } from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.alias = {
      '@castlabs/prestoplay': resolve(__dirname, 'vendor/castlabs-prestoplay'),
    };
  },
  onSuccess: 'cp src/styles.css dist/styles.css',
});
