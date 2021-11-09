import babel from "rollup-plugin-babel";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "index.js",
  output: {
    extend: true,
    file: "build/d3-geo-scale-bar.js",
    format: "umd",
    name: "d3"
  },
  plugins: [
    resolve({
      only: ["d3-format"]
    }),
    babel({
      exclude: "node_modules/**"
    })
  ]
};