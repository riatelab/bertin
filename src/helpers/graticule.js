// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// Graticule
export function addgraticule(selection, projection, options = {}) {
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.8;
  let strokeopacity = options.strokeopacity ? options.strokeopacity : 0.5;
  let strokedasharray = options.strokedasharray ? options.strokedasharray : 2;
  let step = options.step ? options.step : [10, 10];
  step = Array.isArray(step) ? step : [step, step];
  selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "graticule")
    .attr(":inkscape:label", "graticule")
    .append("path")
    .datum(d3.geoGraticule().step(step))
    .attr("d", d3.geoPath(projection))
    .attr("clip-path", "url(#clip)")
    .style("fill", "none")
    .style("stroke", stroke)
    .style("stroke-width", strokewidth)
    .style("stroke-opacity", strokeopacity)
    .style("stroke-dasharray", strokedasharray)
    .attr("clip-path", "url(#clip)");
}
