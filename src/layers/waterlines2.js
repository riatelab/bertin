import { BufferOp, GeoJSONReader, GeoJSONWriter } from "@turf/jsts";
import { union } from "geotoolbox";
import * as d3 from "d3-selection";
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";
//const d3 = Object.assign({}, d3selection, geoProject);

export function waterlines2(selection, projection, options = {}) {
  let geojson = options.geojson;
  let dist =
    options.dist != undefined && options.dist != null ? options.dist : 5;
  let nb = options.nb != undefined && options.nb != null ? options.nb : 3;
  let steps =
    options.steps != undefined && options.steps != null ? options.steps : 8;
  let geom = new GeoJSONReader().read(
    geoProject(union(geojson), projection).features[0]
  );

  //   let buff = BufferOp.bufferOp(geom.geometry, 10, 8);
  //   let newgeom = new GeoJSONWriter().write(buff);

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

  selection
    .append("g")
    .attr("fill", "none")
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", geoPath())
    .attr("stroke", "red");
}
