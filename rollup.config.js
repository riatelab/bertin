// import de nos plugins
import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'src/index.js', // notre fichier source au format ESM
    output: {
        format: 'iife',
        file: 'js/main.iife.min.js',
        // les modules iife doivent être nommés afin de pouvoir y faire référence depuis d'autres modules
        name: 'bertinjs'
    },
    plugins: [
        commonjs(), // prise en charge de require
        noderesolve(), // prise en charge des modules depuis node_modules
        babel({ babelHelpers: 'bundled' }), // transpilation
        terser() // minification
    ]
};
