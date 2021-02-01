import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import { babel } from '@rollup/plugin-babel'

export default [
  {
    input: 'src/index.js',
    output: [{
      name: 'WindowEvents',
      file: 'windowevents.js',
      format: 'umd',
      sourcemap: 'inline'
    },
    {
      name: 'WindowEvents',
      file: 'windowevents.min.js',
      format: 'umd',
      compact: true,
      plugins: [terser()]
    }],
    plugins: [
      resolve(),
      commonjs(),
      babel({
        babelHelpers: 'bundled',
        presets: ['@babel/env']
      })
    ]
  }
]
