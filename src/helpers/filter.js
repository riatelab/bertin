// Filter
import { str2fun } from "./str2fun.js";
export function filter({ x, expression }) {
  let features = [...x.features];

  // Get keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  keys.forEach((d) => {
    expression = expression.replace(d, `d.properties.${d}`);
  });

  expression = "d => " + expression;

  let output = JSON.parse(JSON.stringify(x));
  output.features = features.filter(str2fun(expression));
  return output;
}
