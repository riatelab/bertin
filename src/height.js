// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// Height
export function getheight(features, projection, width, outline) {
  let ref;
  let d;

  if (outline) {
    ref = { type: "Sphere" };
    d = outline.strokewidth ? outline.strokewidth : 0;
  } else {
    ref = features;
    d = 0;
  }
  const [[x0, y0], [x1, y1]] = d3
    .geoPath(projection.fitWidth(width, ref))
    .bounds(ref);
  const dy = Math.ceil(y1 - y0),
    l = Math.min(Math.ceil(x1 - x0), dy);
  projection.scale((projection.scale() * (l - d)) / l).precision(0.2);
  let height = dy;
  return height;
}
