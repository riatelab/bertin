// Imports
import { create } from "d3-selection";
import { scaleLinear } from "d3-scale";
const d3 = Object.assign({}, { create, scaleLinear });

import { geoimport } from "./helpers/geoimport.js";

export function match(geojson, id_geojson, data, id_data) {
  geojson = geoimport(geojson);
  let ids_geojson = geojson.features.map((d) => d.properties[id_geojson]);
  let ids_data = data.map((d) => d[id_data]);
  let all = Array.from(new Set(ids_geojson.concat(ids_data)));
  // Unmatched elements
  let intersection = ids_geojson.filter((x) => ids_data.includes(x));
  // Unmatched geom
  let difference1 = ids_geojson.filter((x) => !ids_data.includes(x));
  // Unmatched data
  let difference2 = ids_data.filter((x) => !ids_geojson.includes(x));
  // matched data
  let mdata = intersection.filter((x) => ids_data.includes(x));
  // matched geom
  let mgeom = intersection.filter((x) => ids_geojson.includes(x));

  //return [ids_geojson, ids_data, all, intersection, difference1, difference2];

  let w = 1000;
  let h = 100;
  let delta = 30;

  let col1 = "#E13689";
  let col2 = "#48A5E3";
  let col3 = "#fcba03";

  let scale = d3.scaleLinear().domain([0, all.length]).range([0, w]);

  const svg = d3
    .create("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("viewBox", [0, 0, w, h])
    .attr(
      "style",
      `max-width: 100%; height: auto; height: intrinsic; background-color: white;`
    );

  // defs

  var defs = svg.append("defs");

  const pattern = defs
    .append("pattern")
    .attr("id", "hatch")
    .attr("patternUnits", "userSpaceOnUse")
    .attr("width", 5)
    .attr("height", 5);

  pattern
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 5)
    .attr("y1", 5)
    .attr("stroke", "#ffcc36")
    .attr("stroke-width", 1)
    .attr("stroke-opacity", 1);

  // Geometries
  svg
    .append("rect")
    .attr("x", 0)
    .attr("y", delta - 5)
    .attr("height", 10)
    .attr("width", scale(difference1.length + intersection.length))
    .attr("stroke", "none")
    .attr("fill", "#CCC")
    //.attr("fill", col1)
    .attr("fill-opacity", 0.35);

  // Data

  svg
    .append("rect")
    .attr("x", w - scale(difference2.length + intersection.length))
    .attr("y", h - delta - 5)
    .attr("height", 10)
    .attr("width", scale(difference2.length + intersection.length))
    .attr("stroke", "none")
    .attr("fill", "#CCC")
    .attr("fill-opacity", 0.35);

  // Match

  svg
    .append("rect")
    .attr("x", scale(difference1.length))
    .attr("y", delta)
    .attr("height", h - delta * 2)
    .attr("width", scale(intersection.length))
    .attr("fill", "#ffe599");
  //.attr("fill", "url('#hatch')");

  svg
    .append("rect")
    .attr("x", scale(difference1.length))
    .attr("y", delta)
    .attr("height", h - delta * 2)
    .attr("width", scale(intersection.length))
    //.attr("fill", col3)
    .attr("fill", "url('#hatch')");

  svg
    .append("text")
    .attr("x", w - scale(ids_data.length) + scale(intersection.length) / 2)
    .attr("y", h / 2 + 3)
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "middle")
    .text(`${Math.round((intersection.length / all.length) * 100)}%`)
    .attr("font-size", 40)
    .attr("fill", "black");

  svg
    .append("text")
    .attr("x", w - scale(ids_data.length) + 5)
    .attr("y", delta + 7)
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "hanging")
    .text(`Matched geom`)
    .attr("font-size", 12)
    .attr("fill", "black");

  // ici
  svg
    .append("text")
    .attr("x", w - scale(ids_data.length) + 5)
    .attr("y", h - delta - 8)
    .attr("text-anchor", "start")
    .attr("dominant-baseline", "baseline")
    .text(`${intersection.length}/${ids_geojson.length}`)
    .attr("font-size", 14)
    .attr("fill", "black");

  svg
    .append("text")
    .attr("x", w - scale(difference2.length) - 5)
    .attr("y", delta + 7)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "hanging")
    .text(`Matched data`)
    .attr("font-size", 12)
    //.attr("font-weight", "bold")
    .attr("fill", "black");

  svg
    .append("text")
    .attr("x", w - scale(difference2.length) - 5)
    .attr("y", h - delta - 8)
    .attr("text-anchor", "end")
    .attr("dominant-baseline", "baseline")
    .text(`${intersection.length}/${ids_data.length}`)
    .attr("font-size", 14)
    .attr("fill", "black");

  // Geometries

  svg
    .append("line")
    .attr("x1", 0)
    .attr("y1", delta)
    .attr("x2", scale(ids_geojson.length))
    .attr("y2", delta)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  svg
    .append("line")
    .attr("x1", 0.5)
    .attr("y1", delta - 5)
    .attr("x2", 0.5)
    .attr("y2", delta + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  svg
    .append("line")
    .attr("x1", scale(ids_geojson.length) - 0.5)
    .attr("y1", delta - 5)
    .attr("x2", scale(ids_geojson.length) - 0.5)
    .attr("y2", delta + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  // Data

  svg
    .append("line")
    .attr("x1", w - scale(ids_data.length))
    .attr("y1", h - delta)
    .attr("x2", w)
    .attr("y2", h - delta)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  svg
    .append("line")
    .attr("x1", w - 0.5)
    .attr("y1", h - delta - 5)
    .attr("x2", w - 0.5)
    .attr("y2", h - delta + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  svg
    .append("line")
    .attr("x1", w - scale(ids_data.length) + 0.5)
    .attr("y1", h - delta - 5)
    .attr("x2", w - scale(ids_data.length) + 0.5)
    .attr("y2", h - delta + 5)
    .attr("stroke", "black")
    .attr("stroke-width", 0.5);

  svg
    .append("text")
    .attr("x", w - scale(ids_data.length / 2))
    .attr("y", h - 5)
    .attr("text-anchor", "middle")
    .text(`DATA`)
    .attr("font-size", 28)
    .attr("font-weight", "bold")
    .attr("fill", "#CCC")
    .attr("opacity", 0.45);

  svg
    .append("text")
    .attr("x", scale(ids_geojson.length / 2))
    .attr("y", delta - 8)
    .attr("text-anchor", "middle")
    .text(`GEOMETRIES`)
    .attr("font-size", 28)
    .attr("font-weight", "bold")
    .attr("fill", "#CCC")
    .attr("opacity", 0.45);

  return Object.assign(svg.node(), {
    matched: intersection,
    unmatched_geom: difference1,
    unmatched_data: difference2,
    matched_data: mdata,
    matched_geom: mgeom,
  });
}
