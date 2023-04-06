import { buffer } from "../helpers/buffer.js";
import { union } from "../helpers/union.js";
import { scaleLinear } from "d3-scale";
import { geoPath } from "d3-geo";
import { geoProject } from "d3-geo-projection";
const d3 = Object.assign({}, { scaleLinear, geoPath, geoProject });

export function waterlines(
  selection,
  projection,
  geojson,
  clipid,
  options = {}
) {
  let precision = options.precision != undefined ? options.precision : 3;
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

  let geom = d3.geoProject(union(geojson), projection);

  let features = [];

  let buff = buffer(geom, { dist: dist, wgs84: false, step: precision });
  features.push(buff.features[0]);

  for (let i = 1; i <= nb; i++) {
    buff = buffer(buff, { dist: dist, wgs84: false, step: precision });
    features.push(buff.features[0]);
  }

  selection
    .append("g")
    .attr("class", options.id)
    .attr("data-layer", JSON.stringify({ _type: "waterlines" }))
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid})`)
    .selectAll("path")
    .data(features)
    .join("path")
    .attr("d", d3.geoPath())
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
