import { geoOrthographic } from "d3-geo";
const d3 = Object.assign({}, { geoOrthographic });

export function Globe(str) {
  const projection = d3.geoOrthographic();

  return projection.rotate(globecenter(str));
}

function globecenter(str) {
  if (str && str.substring(0, 5).toLowerCase() == "globe") {
    str = str.match(/\((.*)\)/);
    return str
      ? str
          .pop()
          .split(",")
          .map((d) => +d)
      : [0, 0];
  }
}

