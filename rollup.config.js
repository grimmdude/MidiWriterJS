import typescript from '@rollup/plugin-typescript';
import replace from "@rollup/plugin-replace";
import {nodeResolve} from '@rollup/plugin-node-resolve';

export default [
  {
    input: "src/main.ts",
    output: [
      {
        file: "browser/midiwriter.js",
        format: "iife",
        name: "MidiWriter",
      },
      {
        file: "build/index.browser.js",
        format: "es",
        name: "MidiWriter",
      },
    ],
    plugins: [
      typescript(),
      replace({
        "process.browser": true,
        "preventAssignment": true 
      }),
      nodeResolve(),
    ],
  },
  {
    input: 'src/main.ts',
    output: {
      file: 'build/index.js',
      format: 'cjs',
      exports: 'named',
    },
    external: ['tonal-midi', 'fs'],
    plugins: [
      typescript(),
      nodeResolve()
    ]
  }
];