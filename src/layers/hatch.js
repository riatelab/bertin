import { getattr } from "../helpers/getattr.js";

export function hatch(selection, options = {}, width, height) {
  let defs = selection.append("defs");
  let visibility = options.visibility ? options.visibility : "visible";
  const stroke = options.stroke ? options.stroke : "#786d6c";
  const strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : 2;
  const strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 0.1;
  const angle = options.angle != undefined ? options.angle : 45;
  const spacing = options.spacing != undefined ? options.spacing : 8;
  const strokeDasharray = options.strokeDasharray
    ? options.strokeDasharray
    : "none";

  const unique =
    Date.now().toString(36) + Math.random().toString(36).substring(2);
  const pattern = defs
    .append("pattern")
    .attr("class", "pattern" + options.id)
    .attr("id", `hatch${unique}`)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", spacing)
    .attr("height", spacing)
    .attr("patternTransform", `rotate(${angle})`);

  console.log(unique);

  pattern
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y1", spacing)
    .attr("visibility", visibility)
    .attr("stroke", stroke)
    .attr("stroke-linejoin", "butt")
    .attr("stroke-width", strokeWidth)
    .attr("stroke-dasharray", strokeDasharray)
    .attr("stroke-opacity", strokeOpacity);

  selection
    .append("g")
    .attr("class", options.id)
    .attr("type", "hatch")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height)
    .attr("fill", "url('#hatch" + unique + "')");
}
