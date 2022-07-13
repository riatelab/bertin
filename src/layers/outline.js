// Imports
import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });

// outline
export function outline(selection, projection, options = {}) {
  let fill = options.fill ? options.fill : "#add8f7";
  let fillOpacity = options.fillOpacity != undefined ? options.fillOpacity : 1;
  let stroke = options.stroke ? options.stroke : "none";
  let strokeWidth = options.strokeWidth != undefined ? options.strokeWidth : 1;
  selection
    .append("g")
    .append("path")
    .attr("d", d3.geoPath(projection)({ type: "Sphere" }))
    .attr("fill", fill)
    .attr("fill-opacity", fillOpacity)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth);
}
