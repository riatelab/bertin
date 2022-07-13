import { BufferOp, GeoJSONReader, GeoJSONWriter } from "@turf/jsts";
//import { BufferOp, GeoJSONReader, GeoJSONWriter } from "jsts";
import { union } from "geotoolbox";
import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3selection, d3scale);
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";
//const d3 = Object.assign({}, d3selection, geoProject);

export function waterlines(
  selection,
  projection,
  geojson,
  clipid,
  options = {}
) {
  let dist = options.dist != undefined ? options.dist : 5;
  let nb = options.nb != undefined ? options.nb : 3;
  let steps = options.steps != undefined ? options.steps : 8;
  let stroke = options.stroke != undefined ? options.stroke : "#5d81ba";
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : [1, 0.1];
  let strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : [1.2, 0.2];
  let strokeDasharray =
    options.strokeDasharray != undefined ? options.strokeDasharray : "none";
  let strokeLinecap =
    options.strokeLinecap != undefined ? options.strokeLinecap : "round";
  let strokeLinejoin =
    options.strokeLinejoin != undefined ? options.strokeLinejoin : "round";

  let geom = new GeoJSONReader().read(
    geoProject(union(geojson), projection).features[0]
  );
  let features = [];
  for (let i = 1; i <= nb; i++) {
    let buff = BufferOp.bufferOp(geom.geometry, i * dist, steps);
    let newgeom = new GeoJSONWriter().write(buff);
    features.push({
      type: "Feature",
      properties: { dist: i * dist },
      geometry: newgeom,
    });
  }

  // selection
  //   .append("g")
  //   .attr("fill", "none")
  //   .selectAll("path")
  //   .data(features)
  //   .join("path")
  //   .attr("d", geoPath())
  //   .attr("stroke", "red");

  selection
    .append("g")
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", geoPath())
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
