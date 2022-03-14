// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// Graticule
export function graticule(selection, projection, options = {}, clipid) {
  let stroke = options.stroke ? options.stroke : "white";
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.8;
  let strokeOpacity = options.strokeOpacity ? options.strokeOpacity : 0.5;
  let strokeDasharray = options.strokeDasharray ? options.strokeDasharray : 2;
  let strokeLinecap = options.strokeLinecap ?? "round"
  let strokeLinejoin = options.strokeLinejoin ?? "round"

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
    .style("stroke-dasharray", strokeDasharray)

}
