
import {resolve} from 'path'
import { defineConfig } from 'vite'

import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import libCss from 'vite-plugin-libcss';

module.exports = defineConfig({
  plugins: [vue(), dts({insertTypesEntry: true, copyDtsFiles: false}), libCss()],
  resolve: { dedupe: ['vue'] },
  build: {
    lib: {
      name: 'vue3PuzzleVcode',
      entry: resolve(__dirname, 'src/lib/main.ts'),
      fileName: (format) => `vue3-puzzle-vcode.${format}.js`
    },
    cssCodeSplit: true,
    
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue'
        }
      }
    }
  }
})