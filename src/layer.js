//imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// function
export function layer({
  projection = d3.geoPatterson(), // a D3 projection; null for pre-projected geometry
  features, // a GeoJSON feature collection
  outline = projection && projection.rotate ? { type: "Sphere" } : null, // a GeoJSON object for the background
  width = 1000, // outer width, in pixels
  height,
  fill = "#cc76c9", // fill color for outline
  stroke = "white" // stroke color for borders
} = {}) {
  // height auto
  if (height === undefined) {
    let ref;
    //  outline === null ? (ref = features) : (ref = outline);
    outline === null ? (ref = features) : (ref = { type: "Sphere" });
    //height = 400;
    const [[x0, y0], [x1, y1]] = d3.geoPath(projection.fitWidth(width, ref))
      .bounds(ref);
    const dy = Math.ceil(y1 - y0),
      l = Math.min(Math.ceil(x1 - x0), dy);
    projection.scale((projection.scale() * (l - 1)) / l).precision(0.2);
    height = dy;
  }
  const path = d3.geoPath(projection);

  const svg = d3.create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  if (outline != null) {
    svg
      .append("path")
      .attr("fill", "#c2dcf0")
      .attr("stroke", "none")
      .attr("d", path(outline));
  }
  svg
    .append("g")
    .selectAll("path")
    .data(features.features)
    .join("path")
    .attr("d", path)
    .attr("fill", fill)
    .attr("stroke", stroke);

  return Object.assign(svg.node(), {});
}
