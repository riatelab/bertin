import * as d3array from "d3-array";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scale, d3array);

// Thinkness of Links
export function thickness(data, _) {
  // if (typeof _ == "number" || typeof _ == "string") {
  //   return (d) => +_;
  // }
  //
  // if (typeof _ == "object" && typeof _ != "number" && typeof _ != "string") {
  //   let k = _.k ?? 10;
  //   let values = _.values;
  //   let fixmax = _.fixmax ?? undefined;
  //
  //   if (typeof data.features == "object") {
  //     data = data.features.map((d) => d.properties);
  //   }
  //
  //   let valmax =
  //     fixmax == undefined
  //       ? d3.max(data.map((d) => Math.abs(+d[values])))
  //       : fixmax;
  //
  //   return d3.scaleLinear().domain([0, valmax]).range([0, k]);
  // }
}
