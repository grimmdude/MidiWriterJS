import typescript from '@rollup/plugin-typescript';
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default {
  input: 'src/main.ts',
  output: [
    {
      file: 'build/index.cjs',
      format: 'cjs',
      exports: 'default',
    },
    {
      file: 'build/index.mjs',
      format: 'es',
    }
  ],
  external: ['tonal-midi', 'fs', '@tonaljs/midi'],
  plugins: [
    typescript(),
    nodeResolve()
  ]
};
