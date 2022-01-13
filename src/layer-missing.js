// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
import {figuration } from "./figuration.js";
import {addtooltip } from "./tooltip.js";
import {legbox } from "./leg-box.js";

export function layermissing(selection, projection, clipid, options = {}){
  let geojson = options.geojson;
  let values = options.values;
  let fill = options.fill ? options.fill : "white";
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;

  let missing = geojson.features.filter(
    (d) => d.properties[values] == undefined
  );

  // If lines
  if (figuration(geojson) == "l") {
    stroke = options.stroke ? options.stroke : "white";
    fill = options.fill ? options.fill : "none";
    strokeWidth = options.strokeWidth ? options.strokeWidth : 1;
  }

  selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "missing")
    .attr(":inkscape:label", "missing")
    .selectAll("path")
    .data(missing)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity)
    .attr("clip-path", `url(#clip_${clipid}`);

  // Legend

  legbox(selection, {
    x: options.leg_x,
    y: options.leg_y,
    w: options.leg_w,
    h: options.leg_h,
    text: options.leg_text ? options.leg_text : "Missing data",
    fontSize: options.leg_fontSize2,
    stroke: options.leg_stroke,
    fillOpacity: options.leg_fillOpacity
      ? options.leg_fillOpacity
      : fillOpacity,
    fill: fill,
    strokeWidth: options.leg_strokeWidth,
    txtcol: options.leg_txtcol
  });
}
