import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });
import { union } from "../helpers/union.js";

export function shadow(selection, projection, clipid, options = {}) {
  let geojson = options.geojson;
  let fill = options.fill ? options.fill : "#35383d";
  let dx = options.dx != undefined ? options.dx : 3;
  let dy = options.dy != undefined ? options.dy : 3;
  let stdDeviation =
    options.stdDeviation != undefined ? options.stdDeviation : 1.5;
  let opacity = options.opacity != undefined ? options.opacity : 0.7;
  let stroke = "none";

  let merged = union(geojson);

  let defs = selection.append("defs");
  defs
    .append("filter")
    .attr("id", "blur")
    .append("feGaussianBlur")
    .attr("stdDeviation", stdDeviation);

  const path = d3.geoPath(projection);

  selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "shadow", dx, dy }))
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
    .append("path")
    .datum(merged)
    .attr("class", "onglobe")
    .attr("d", path)
    .attr("fill", fill)
    .attr("opacity", opacity)
    .attr("stroke", stroke)
    .attr("filter", "url(#blur)")
    .attr("transform", `translate(${dx} ${dy})`);
}
