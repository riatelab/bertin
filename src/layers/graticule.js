// Imports
import { geoPath, geoGraticule } from "d3-geo";
const d3 = Object.assign({}, { geoPath, geoGraticule });

// Graticule
export function graticule(selection, projection, options = {}, clipid) {
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth =
    options.strokeWidth != undefined ? options.strokeWidth : 0.8;
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 0.5;
  let strokeDasharray =
    options.strokeDasharray != undefined ? options.strokeDasharray : 2;
  let strokeLinecap = options.strokeLinecap ? options.strokeLinecap : "round";
  let strokeLinejoin = options.strokeLinejoin
    ? options.strokeLinejoin
    : "round";

  let step = options.step ? options.step : [10, 10];
  step = Array.isArray(step) ? step : [step, step];
  selection
    .append("g")
    .attr("clip-path", clipid == null ? `none` : `url(#clip_${clipid}`)
    .append("path")
    .datum(d3.geoGraticule().step(step))
    .attr("d", d3.geoPath(projection))
    .style("fill", "none")
    .style("stroke", stroke)
    .style("stroke-width", strokeWidth)
    .style("stroke-opacity", strokeOpacity)
    .style("stroke-linecap", strokeLinecap)
    .style("stroke-linejoin", strokeLinejoin)
    .style("stroke-dasharray", strokeDasharray);
}
