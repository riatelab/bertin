import { union } from "geotoolbox";
import { geoPath } from "d3-geo";
const d3 = Object.assign({}, { geoPath });

export function inner(selection, projection, options = {}) {
  let display = options.display == false ? false : true;
  if (display) {
    let geojson = options.geojson;
    let thickness =
      options.thickness != null && options.thickness != undefined
        ? options.thickness
        : 7;
    let fill =
      options.fill != null && options.fill != undefined
        ? options.fill
        : "#9e9477";
    let fillOpacity =
      options.fillOpacity != null && options.fillOpacity != undefined
        ? options.fillOpacity
        : 0.2;

    let blur =
      options.blur != null && options.blur != undefined ? options.blur : 4;

    const id =
      Date.now().toString(36) + Math.random().toString(36).substring(2);
    let defs = selection.append("defs");
    defs
      .append("filter")
      .attr("id", `blur${id}`)
      .append("feGaussianBlur")
      .attr("stdDeviation", blur);

    let merged = union(geojson);

    selection
      .append("clipPath")
      .attr("id", `inner${id}`)
      .append("path")
      .datum(merged)
      .attr("d", d3.geoPath(projection));

    selection
      .append("g")
      .attr("clip-path", `url(#inner${id})`)
      .append("path")
      .datum(merged)
      .attr("fill", "none")
      .attr("stroke", fill)
      .attr("stroke-linecap", "round")
      .attr("stroke-linejoin", "round")
      .attr("stroke-opacity", fillOpacity)
      .attr("stroke-width", thickness * 2)
      .attr("filter", `url(#blur${id})`)
      .attr("d", d3.geoPath(projection));
  }
}
