import babel from '@rollup/plugin-babel';
import replace from "@rollup/plugin-replace";
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default [
  {
    input: "src/main.js",
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
      replace({
        "process.browser": true,
        "preventAssignment": true 
      }),
      nodeResolve(),
      babel({
        exclude: "node_modules/**", // only transpile our source code
        plugins: ["@babel/plugin-transform-destructuring"],
        babelHelpers: 'bundled'
      }),
      
    ],
  },
  {
    input: 'src/main.js',
    output: {
      file: 'build/index.js',
      format: 'cjs',
      exports: 'default',
    },
    external: ['tonal-midi', 'fs'],
    plugins: [
      babel({
        exclude: 'node_modules/**', // only transpile our source code
        plugins: ['@babel/plugin-transform-destructuring'],
        babelHelpers: 'bundled'
      })
    ]
  }
];