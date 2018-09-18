import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import replace from 'rollup-plugin-replace'
import { uglify } from 'rollup-plugin-uglify'
import pkg from './package.json'

const babelConfig = require('./babel.config')

const nodeModulesGlob = 'node_modules/**'
const extensions = ['.ts', '.tsx', '.js', '.jsx']
const minify = process.env.MINIFY
const format = process.env.FORMAT
const es = format === 'es'
const umd = format === 'umd'
const cjs = format === 'cjs'

let output

if (es) {
  output = { file: pkg.module, format: 'es' }
} else if (umd) {
  if (minify) {
    output = {
      file: `dist/react-scroll-percentage.umd.min.js`,
      format: 'umd',
    }
  } else {
    output = { file: `dist/react-scroll-percentage.umd.js`, format: 'umd' }
  }
} else if (cjs) {
  output = { file: pkg.main, format: 'cjs' }
} else if (format) {
  throw new Error(`invalid format specified: "${format}".`)
} else {
  throw new Error('no format specified. --environment FORMAT:xxx')
}

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'ReactScrollPercentage',
      globals: {
        react: 'React',
      },
      ...output,
    },
    watch: {
      chokidar: true,
    },
    external: umd
      ? Object.keys(pkg.peerDependencies || {})
      : [
          ...Object.keys(pkg.dependencies || {}),
          ...Object.keys(pkg.peerDependencies || {}),
        ],
    plugins: [
      resolve({
        extensions,
        jsnext: true,
        module: true,
        main: true,
      }),
      commonjs({ include: nodeModulesGlob }),
      babel({
        exclude: nodeModulesGlob,
        extensions,
      }),
      umd &&
        replace({
          'process.env.NODE_ENV': JSON.stringify(
            minify ? 'production' : 'development',
          ),
        }),
      minify && uglify(),
    ].filter(Boolean),
  },
]
