import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import * as d3scalechromatic from "d3-scale-chromatic";
const d3 = Object.assign({}, d3selection, d3scalechromatic, d3array, d3geo, d3scale);
import {addtooltip } from "./tooltip.js";
import {poly2points } from "./poly2points.js";
// import {legchoro } from "./leg-choro.js"
// import {legtypo } from "./leg-typo.js";
import {figuration } from "./figuration.js";
import {chorotypo } from "./chorotypo.js";
import {thickness } from "./thickness.js";

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
  let stroke = options.stroke ?? cols[Math.floor(Math.random() * cols.length)];
  let strokeWidth = options.strokeWidth ?? 1.5;
  let strokeOpacity = options.strokeOpacity ?? 0.9;
  let geojson = options.geojson;
  let geojson_id = options.geojson_id;
  let data = options.data;
  let data_i = options.data_i ?? "i";
  let data_j = options.data_j ?? "j";
  let data_fij = options.data_fij ?? "fij";
  //let tooltip = options.tooltip ?? "";

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

  //return coordsbyid;

  selection
    .append("g")
    .selectAll("line")
    .data(
      data.sort((a, b) =>
        d3.descending(Math.abs(+a[data_fij]), Math.abs(+b[data_fij]))
      )
    )
    .join("line")
    .attr("x1", (d) => coordsbyid.get(d[data_i]) ? coordsbyid.get(d[data_i])[0] : undefined)
    .attr("y1", (d) => coordsbyid.get(d[data_i]) ? coordsbyid.get(d[data_i])[1] : undefined)
    .attr("x2", (d) => coordsbyid.get(d[data_i]) ? coordsbyid.get(d[data_j])[0] : undefined)
    .attr("y2", (d) => coordsbyid.get(d[data_i]) ? coordsbyid.get(d[data_j])[1] : undefined)
    .attr("fill", "none")
    .attr("stroke", stroke)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-width", (d) =>
      thickness(data, strokeWidth)(d[strokeWidth.values])
    );
}
