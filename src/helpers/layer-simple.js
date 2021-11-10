// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import { figuration } from "./utils.js";
export function simpleLayer(selection, projection, features, options = {}) {
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3"
  ];
  let fill = options.fill
    ? options.fill
    : cols[Math.floor(Math.random() * cols.length)];
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let fillopacity = options.fillopacity ? options.fillopacity : 1;

  // If lines
  if (figuration(features) == "l") {
    stroke = options.stroke
      ? options.stroke
      : cols[Math.floor(Math.random() * cols.length)];
    fill = options.fill ? options.fill : "none";
    strokewidth = options.strokewidth ? options.strokewidth : 1;
  }

  selection
    .append("g")
    .selectAll("path")
    .data(features.features)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity);
}
