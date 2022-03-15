// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// outline
export function outline(selection, projection,  options = {}) {
  let fill = options.fill ? options.fill : "#add8f7";
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let stroke = options.stroke ? options.stroke : "none";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 1;
  selection
    .append("g")
    .append("path")
    .attr("d", d3.geoPath(projection)({ type: "Sphere" }))
    .attr("fill", fill)
    .attr("fill-opacity",fillOpacity)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
}
