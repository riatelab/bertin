import { grid } from "../helpers/grid.js";
import { select } from "d3-selection";
import { scaleLinear } from "d3-scale";
import { ascending, max } from "d3-array";
import { geoPath } from "d3-geo";

const d3 = Object.assign(
  {},
  {
    geoPath,
    max,
    scaleLinear,
    ascending,
    select,
  }
);

export function ridge(
  selection,
  projection,
  options = {},
  clipid,
  width,
  height
) {
  let k = options.k ? options.k : 100;
  let fill = options.fill ? options.fill : "#508bab";
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let strokeDasharray = options.strokeDasharray
    ? options.strokeDasharray
    : "none";
  let strokeOpacity = options.strokeOpacity ? options.strokeOpacity : 1;
  let operator = options.operator ? options.operator : "sum";
  let geoprocessing = options.geoprocessing
    ? options.geoprocessing
    : "dotinpoly";

  let mygrid = grid({
    geojson: options.geojson,
    blur:
      options.blur == null || options.blur == undefined ? 0.4 : options.blur,
    values: options.values,
    projection: projection,
    width: width,
    height: height,
    keep: true,
    step: options.step,
    operator: operator,
    geoprocessing: geoprocessing,
  })
    .features.map((d) => ({
      x: d.geometry.coordinates[0],
      y: d.geometry.coordinates[1],
      value: d.properties.value,
    }))
    .sort((a, b) => d3.ascending(a.y, b.y) || d3.ascending(a.x, b.x));

  let clip =
    "ridge" + Date.now().toString(36) + Math.random().toString(36).substring(2);

  let dd = JSON.stringify({ _type: "ridge", mygrid, clip, strokeWidth });

  let ycoords = Array.from(new Set(mygrid.map((d) => d.y)));

  let scale = d3
    .scaleLinear()
    .domain([0, d3.max(mygrid.map((d) => d.value))])
    .range([0, k]);

  let features = [];

  ycoords.forEach((y) => {
    let coords = [];
    mygrid
      .filter((d) => d.y == y)
      .forEach((d) => coords.push([d.x, d.y - scale(d.value)]));

    let linetring = {
      type: "LineString",
      coordinates: coords,
    };

    features.push({
      type: "Feature",
      properties: { y },
      geometry: linetring,
    });
  });

  let g = selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", dd)
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokeWidth)
    .attr("fill-opacity", fillOpacity)
    .attr("stroke-opacity", strokeOpacity)
    .attr("stroke-dasharray", strokeDasharray);

  let g2 = selection.append("g");

  features.forEach((d, i) => {
    g2.append("clipPath")
      .attr("id", clip + i)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("height", d.properties.y - strokeWidth - 1)
      .attr("width", width)
      .attr("fill", "blue");

    g.append("path")
      .datum(d)
      .attr("d", d3.geoPath())
      .attr("clip-path", "url(#" + clip + i + ")");
  });
}
