import {poly2points } from "./poly2points.js";
import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

export function layerlabel(selection, projection, clipid, options = {}){
  let geojson = options.geojson;
  let values = options.values;
  let fill = options.fill ? options.fill : "#474342";
  let fontSize = options.fontSize ? options.fontSize : 10;
  let fontFamily = options.fontFamily ? options.fontFamily : "Robotto";
  let textDecoration = options.textDecoration ? options.textDecoration : "none";
  let fontWeight = options.fontWeight ? options.fontWeight : "normal";
  let fontStyle = options.fontStyle ? options.fontStyle : "normal";
  let opacity = options.opacity ? options.opacity : 1;

  const features = poly2points(geojson);

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
    .attr("alignment-baseline", "middle")
    .text((d) => d.properties[values]);
}
