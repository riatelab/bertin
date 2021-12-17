// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

export function getheight(layers, extent, margin, projection, width) {

    let ref;
    if (extent) {
      ref = extent;
    } else {
      if (layers.find((d) => d.type == "outline") != undefined) {
        let outline = layers.find((d) => d.type == "outline");
        ref = { type: "Sphere" };
      } else {
        let l = layers.map((d) => d.geojson).filter((d) => d !== undefined);
        let all = [];
        l.forEach((d) => all.push(d.features));
        ref = {
          type: "FeatureCollection",
          features: all.flat()
        };
      }
    }

    const [[x0, y0], [x1, y1]] = d3
      .geoPath(projection.fitWidth(width - margin * 2, ref))
      .bounds(ref);

    let trans = projection.translate();
    projection.translate([trans[0] + margin, trans[1] + margin]);

    return Math.ceil(y1 - y0) + margin * 2;
  }
