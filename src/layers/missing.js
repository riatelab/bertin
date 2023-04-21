import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });

import { figuration } from "../helpers/figuration.js";
import { addtooltip } from "../helpers/tooltip.js";
import { legsimple } from "../legend/leg-simple.js";

export function missing(selection, projection, options = {}, clipid) {
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
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "missing" }))
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
    .selectAll("path")
    .data(missing)
    .join("path")
    .attr("class", "onglobe")
    .attr("d", d3.geoPath(projection))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity);

  // Legend

  legsimple(selection, {
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
    txtcol: options.leg_txtcol,
  });
}
