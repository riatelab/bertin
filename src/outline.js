// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// outline
export function addoutline(selection, projection, clipid, options = {}) {
  let fill = options.fill ? options.fill : "#add8f7";
  let stroke = options.stroke ? options.stroke : "none";
  let strokewidth = options.strokewidth ? options.strokewidth : 1;
  selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "outline")
    .attr(":inkscape:label", "outline")
    .append("path")
    .attr("d", d3.geoPath(projection)({ type: "Sphere" }))
    .attr("clip-path", `url(#clip_${clipid}_rectangle)`)
    .attr("d", d3.geoPath(projection)({ type: "Sphere" }))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("clip-path", "url(#clip)");
}
