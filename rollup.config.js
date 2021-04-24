import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import clear from 'rollup-plugin-clear';
import sass from 'rollup-plugin-sass';
import pkg from './package.json';

const isProduction = process.env.PROD;

export default {
  input: './src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
      strict: false,
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    clear({
      targets: ['dist'],
    }),
    sass({
      insert: true,
    }),
    typescript(),
    isProduction && terser(),
  ],
};
