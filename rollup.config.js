import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

const iife = {
    input: 'src/index.js',
    output: {
        format: 'iife',
        file: 'dist/main.iife.min.js',
        name: 'bertin'
    },
    plugins: [
        commonjs(),
        noderesolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};

const esm = {
    input: 'src/index.js',
    output: {
        format: 'es',
        file: 'dist/main.esm.min.js'
    },
    plugins: [
        commonjs(),
        noderesolve(),
        babel({ babelHelpers: 'bundled' }),
        terser()
    ]
};

const conf = process.env.BABEL_ENV === 'esm' ? esm : iife;
export default conf;
