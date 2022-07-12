// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// Graticule
export // Graticule
function hatch(selection, options = {}, width, height) {
  let defs = selection.append("defs");

  const stroke = options.stroke ?? "#786d6c";
  const strokeWidth = options.strokeWidth ?? 2;
  const strokeOpacity = options.strokeOpacity ?? 0.1;
  const angle = options.angle ?? 45;
  const spacing = options.spacing ?? 8;
  const strokeDasharray = options.strokeDasharray ?? "none";

  const id = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const pattern = defs
    .append("pattern")
    .attr("id", `hatch${id}`)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", spacing)
    .attr("height", spacing)
    .attr("patternTransform", `rotate(${angle})`);

  pattern
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y1", spacing)
    .attr("stroke", stroke)
    .attr("stroke-linejoin", "butt")
    .attr("stroke-width", strokeWidth)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("stroke-opacity", strokeOpacity);

  selection
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "url('#hatch" + id + "')");
}
