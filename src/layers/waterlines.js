import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3scale from "d3-scale";
import * as topojsonserver from "topojson-server";
import * as topojsonclient from "topojson-client";
import buffer from "@turf/buffer";

const d3 = Object.assign({}, d3selection, d3geo, d3scale);
const topojson = Object.assign({}, topojsonserver, topojsonclient);

import { topo2geo } from "../helpers/topo2geo.js";

export function waterlines(
  selection,
  projection,
  geojson,
  clipid,
  options = {}
) {
  let dist = options.dist ?? 200;
  let unit = options.unit ?? "kilometers";
  let nb = options.nb ?? 5;
  let steps = options.steps ?? 8;

  let stroke = options.stroke ?? "#5d81ba";
  let strokeOpacity = options.strokeOpacity ?? [1, 0.1];
  let strokeWidth = options.strokeWidth ?? [1.2, 0.2];
  let strokeDasharray = options.strokeDasharray ?? "none";
  let strokeLinecap = options.strokeLinecap ?? "round";
  let strokeLinejoin = options.strokeLinejoin ?? "round";

  let topo = topojson.topology({ foo: topo2geo(geojson) });
  let merged = topojson.merge(topo, topo.objects.foo.geometries);

  let features = [];
  for (let i = 1; i <= nb; i++) {
    features.push(buffer(merged, dist * i, { units: unit, steps: steps }));
  }

  selection
    .append("g")
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", d3.geoPath(projection))
    .attr("fill", "none")
    .attr("stroke-opacity", (d, i) =>
      Array.isArray(strokeOpacity)
        ? d3.scaleLinear().domain([1, nb]).range(strokeOpacity)(i)
        : strokeOpacity
    )
    .attr("stroke-width", (d, i) =>
      Array.isArray(strokeWidth)
        ? d3.scaleLinear().domain([1, nb]).range(strokeWidth)(i)
        : strokeWidth
    )
    .attr("stroke", (d, i) =>
      Array.isArray(stroke)
        ? d3.scaleLinear().domain([1, nb]).range(stroke)(i)
        : stroke
    )
    .attr("stroke-dasharray", strokeDasharray)
    .attr("stroke-linecap", strokeLinecap)
    .attr("stroke-linejoin", strokeLinejoin);
}
