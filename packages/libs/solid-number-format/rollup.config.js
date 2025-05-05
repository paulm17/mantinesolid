import { uglify } from 'rollup-plugin-uglify';
import fileSize from 'rollup-plugin-filesize';
import license from 'rollup-plugin-license';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import buble from '@rollup/plugin-buble';
import resolve from 'rollup-plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';

import PACKAGE from './package.json';
const fullYear = new Date().getFullYear();

const banner = `${PACKAGE.name} - ${PACKAGE.version}
  Author : ${PACKAGE.author}
  Copyright (c) ${fullYear !== 2016 ? '2016,' : ''} ${fullYear} to ${
  PACKAGE.author
}, released under the ${PACKAGE.license} license.
  ${/*PACKAGE.repository.url*/ ''}`;

  const globals = {
    'solid-js': 'Solid',
    'solid-js/web': 'Solid',
  };

const defaultConfig = {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/solid-number-format.es.js',
      format: 'esm',
      globals,
      exports: 'auto',
    },
    {
      file: 'dist/solid-number-format.cjs.js',
      format: 'cjs',
      globals,
      exports: 'auto',
    },
    {
      file: 'dist/solid-number-format.js',
      format: 'umd',
      name: 'NumberFormat',
      globals,
      exports: 'auto',
    },
  ],
  external: ['solid-js', 'solid-js/web'],
  plugins: [
    typescript({
      target: 'es2016',
      jsx: 'preserve',
      jsxImportSource: 'solid-js',
    }),
    babel({
      babelHelpers: 'bundled',
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      presets: ['babel-preset-solid'],
      exclude: 'node_modules/**',
    }),
    buble({
      objectAssign: true,
      jsx: 'preserve',
      jsxImportSource: 'solid-js',
      transforms: {
        dangerousForOf: true,
      },
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    resolve(),
    commonjs({
      include: /node_modules/,
    }),
    fileSize(),
    license({
      banner,
    }),
  ],
};

const minConfig = {
  ...defaultConfig,
  output: {
    file: 'dist/solid-number-format.min.js',
    format: 'umd',
    name: 'NumberFormat',
    globals,
    exports: 'auto',
  },
  plugins: [...defaultConfig.plugins, uglify()],
};

export default [defaultConfig, minConfig];
