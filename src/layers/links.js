import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import * as d3scalechromatic from "d3-scale-chromatic";
const d3 = Object.assign({}, d3selection, d3scalechromatic, d3array, d3geo, d3scale);

import { addtooltip } from "../helpers/tooltip.js";
import { poly2points } from "../helpers/poly2points.js";
import { figuration } from "../helpers/figuration.js";
import { chorotypo } from "../helpers/chorotypo.js";
import { thickness } from "../helpers/thickness.js";
import { legthickness } from "../helpers/leg-thickness.js";


export function links(selection, projection, options = {}, clipid) {
  let cols = [
    "#66c2a5",
    "#fc8d62",
    "#8da0cb",
    "#e78ac3",
    "#a6d854",
    "#ffd92f",
    "#e5c494",
    "#b3b3b3"
  ];
  let strokeLinecap = options.strokeLinecap ?? "butt"
  let stroke = options.stroke ?? cols[Math.floor(Math.random() * cols.length)];
  let strokeWidth = options.strokeWidth ?? 1.5;
  let strokeOpacity = options.strokeOpacity ?? 0.9;
  let geojson = options.geojson;
  let geojson_id = options.geojson_id;
  let data = options.data;
  let data_i = options.data_i ?? "i";
  let data_j = options.data_j ?? "j";
  //let tooltip = options.tooltip ?? "";

if (data.length > 0){

  let dots;
  if (figuration(geojson) == "p") {
    dots = geojson.features;
  } else {
    dots = poly2points(geojson);
  }

  const coordsbyid = new Map(
    dots.map((d) => [
      d.properties[geojson_id],
      projection(d.geometry.coordinates)
    ])
  );

  selection
    .append("g")
    .selectAll("line")
    .data
    (
      data.sort((a, b) =>
        d3.descending(Math.abs(+a[strokeWidth.values]), Math.abs(+b[strokeWidth.values]))
      )
    )
    .join("line")
    .attr("x1", (d) => coordsbyid.get(d[data_i]) && coordsbyid.get(d[data_j]) ? coordsbyid.get(d[data_i])[0] : undefined)
    .attr("y1", (d) => coordsbyid.get(d[data_i]) && coordsbyid.get(d[data_j]) ? coordsbyid.get(d[data_i])[1] : undefined)
    .attr("x2", (d) => coordsbyid.get(d[data_i]) && coordsbyid.get(d[data_j]) ? coordsbyid.get(d[data_j])[0] : undefined)
    .attr("y2", (d) => coordsbyid.get(d[data_i]) && coordsbyid.get(d[data_j]) ? coordsbyid.get(d[data_j])[1] : undefined)
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-linecap",strokeLinecap)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-width", (d) =>
      thickness(data, strokeWidth)(d[strokeWidth.values])
    );


// legend
const vmax = d3.max(data.map((d) => +d[strokeWidth.values]))
const smax = thickness(data, { k: strokeWidth.k, values: strokeWidth.values, fixmax: strokeWidth.fixmax})(vmax)

legthickness(selection, {
x: strokeWidth.leg_x,
y: strokeWidth.leg_y,
valmax: vmax,
sizemax: smax,
title: strokeWidth.leg_title ?? strokeWidth.values,
fontSize: strokeWidth.leg_fontSize,
fontSize2: strokeWidth.leg_fontSize2,
fill: stroke,
fillOpacity: strokeOpacity,
txtcol: strokeWidth.leg_txtcol,
w: strokeWidth.leg_w,
round: strokeWidth.leg_round
})

}

}
