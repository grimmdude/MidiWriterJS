import babel from '@rollup/plugin-babel';

export default {
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
};