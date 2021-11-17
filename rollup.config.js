
// import de nos plugins
import commonjs from '@rollup/plugin-commonjs';
import noderesolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import copy from 'rollup-plugin-copy';

export default {
    input: 'src/index.js',
    output: {
        format: 'umd',
        file: 'dist/index.min.js',
        name: 'bertin'
    },
    plugins: [
        commonjs(), // prise en charge de require
        noderesolve(), // prise en charge des modules depuis node_modules
        babel({ babelHelpers: 'bundled' }), // transpilation
        terser(), // minification
        copy({
      targets: [
        { src: 'dist/index.min.js', dest: '/var/www/html/npm_test/bertin' }
      ]
    })
    ]
};


// // import de nos plugins
// import commonjs from '@rollup/plugin-commonjs';
// import noderesolve from '@rollup/plugin-node-resolve';
// import babel from '@rollup/plugin-babel';
// import { terser } from 'rollup-plugin-terser';
//
// export default {
//     input: 'src/index.js',
//     output: {
//         format: 'umd',
//         file: 'dist/index.min.js',
//         name: 'bertin'
//     },
//     plugins: [
//         commonjs(), // prise en charge de require
//         noderesolve(), // prise en charge des modules depuis node_modules
//         babel({ babelHelpers: 'bundled' }), // transpilation
//         terser() // minification
//     ]
// };
