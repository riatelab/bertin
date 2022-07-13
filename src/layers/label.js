import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

import { topo2geo } from "../helpers/topo2geo.js";
import { centroid } from "geotoolbox";

export function label(selection, projection, options = {}, clipid) {
  let geojson = topo2geo(options.geojson);
  let values = options.values;
  let fill = options.fill ? options.fill : "#474342";
  let fontSize = options.fontSize ? options.fontSize : 10;
  let fontFamily = options.fontFamily ? options.fontFamily : "Robotto";
  let textDecoration = options.textDecoration ? options.textDecoration : "none";
  let fontWeight = options.fontWeight ? options.fontWeight : "normal";
  let fontStyle = options.fontStyle ? options.fontStyle : "normal";
  let opacity = options.opacity ?? 1;
  let halo = options.halo ?? false;
  let halo_style = options.halo_style ?? ["white", 4, 0.5];

  const features = centroid(geojson).features;

  selection
    .append("g")
    .selectAll("text")
    .data(
      features
        .filter((d) => d.geometry.coordinates != undefined)
        .filter((d) => d.properties[values] != undefined)
    )
    .join("text")
    .attr("x", (d) => projection(d.geometry.coordinates)[0])
    .attr("y", (d) => projection(d.geometry.coordinates)[1])
    .attr("fill", fill)
    .attr("opacity", opacity)
    .attr("font-size", fontSize)
    .attr("font-family", fontFamily)
    .attr("font-style", fontStyle)
    .attr("text-decoration", textDecoration)
    .attr("font-weight", fontWeight)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .attr("paint-order", "stroke")
    .attr("stroke", halo ? halo_style[0] : "none")
    .attr("stroke-width", halo ? halo_style[1] : 0)
    .attr("stroke-opacity", halo ? halo_style[2] : 0)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .text((d) => d.properties[values]);
}
