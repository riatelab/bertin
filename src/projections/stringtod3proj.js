import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3geo, d3geoprojection);

export function stringtod3proj(string) {
  let str = string;
  str = str.replace(/\s/g, "");

  if (str.substring(0, 6) !== "d3.geo") {
    if (str.indexOf(".") === -1) {
      str += "()";
    } else {
      str = str.replace(".", "().");
    }
    str = "d3.geo" + str;
  }

  const createProjection = new Function("d3", `return (${str})`);
  return createProjection(d3);
}
