// import * as d3selection from "d3-selection";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
import * as topojsonserver from "topojson-server";
import * as topojsonclient from "topojson-client";

const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);
const topojson = Object.assign({}, topojsonserver, topojsonclient);

import { figuration } from "../helpers/figuration.js";

export function shadow(selection, projection, geojson, clipid, defs, options = {}) {
  let col = options.col ? options.col : "#35383d";
  let dx = options.dx ? options.dx : 3;
  let dy = options.dy ? options.dy : 3;
  let stdDeviation = options.stdDeviation ? options.stdDeviation : 1.5;
  let opacity = options.opacity ? options.opacity : 0.7;

  let fill = col;
  let stroke = "none";

  let topo = topojson.topology({ foo: geojson });
  let merged = topojson.merge(topo, topo.objects.foo.geometries);

  var blur = defs
    .append("filter")
    .attr("id", "blur")
    .append("feGaussianBlur")
    .attr("stdDeviation", stdDeviation);

  // letstroke =

  // // If lines
  // if (figuration(geojson) == "l") {
  //   col = options.col ? options.col : "none";
  // }

  const path = d3.geoPath(projection);

  selection
    .append("g")
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
    .append("path")
    .datum(merged)
    .attr("d", path)
    .attr("fill", fill)
    .attr("opacity", opacity)
    .attr("stroke", stroke)
    .attr("filter", "url(#blur)")
    .attr("transform", `translate(${dx} ${dy})`);
}
