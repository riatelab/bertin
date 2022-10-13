// Add
import { str2fun } from "./str2fun.js";
export function add({ x, field, expression }) {
  let data = [...x.features.map((d) => ({ ...d.properties }))];

  // Get keys
  let keys = [];
  x.features
    .map((d) => d.properties)
    .forEach((d) => {
      keys.push(Object.keys(d));
    });
  keys = Array.from(new Set(keys.flat()));

  keys.forEach((d) => {
    expression = expression.replace(d, `d.${d}`);
  });

  expression = "d=> " + expression;

  let newfield = data.map(str2fun(expression));
  // let newfield = data.map((d) => d.pop / d.gdp);

  data.forEach((d, i) => {
    d = Object.assign(d, { [field]: newfield[i] });
  });

  let output = JSON.parse(JSON.stringify(x));
  output.features.map((d, i) => (d.properties = { ...data[i] }));
  return output;
}
