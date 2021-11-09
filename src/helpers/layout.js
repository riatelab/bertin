// Imports
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";
import * as d3geoprojection from "d3-geo-projection";
const d3 = Object.assign({}, d3selection, d3geo, d3geoprojection);

// header
function plotHeader(selection, width, options = {}) {
  let fontsize;
  if (options.text) {
    fontsize = 20;
  }
  if (options.fontsize) {
    fontsize = options.fontsize;
  }
  let text = options.text ? options.text : "";
  let fill = options.fill ? options.fill : "#9e9696";

selection
    .append("text")
    .text(text)
    .attr("x", width / 2)
    .attr("y", -fontsize / 2)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("fill", fill)
    .attr("dominant-baseline", "middle")
    .style("font-size", fontsize)
}

// Footer
function plotFooter(selection, width, height, options = {}) {
  let fontsize;
  if (options.text) {
    fontsize = 15;
  }
  if (options.fontsize) {
    fontsize = options.fontsize;
  }
  let text = options.text ? options.text : "";
  let fill = options.fill ? options.fill : "#9e9696";

selection
    .append("text")
    .text(text)
    .attr("x", width / 2)
    .attr("y", height + fontsize / 2)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", fill)
    .attr("dominant-baseline", "middle")
    .style("font-size", fontsize)
    .attr("fill-opacity", 1);
}

// Graticule
function plotGraticule(selection, projection, options = {}) {
  let stroke = options.stroke ? options.stroke : "white";
  let strokewidth = options.strokewidth ? options.strokewidth : 0.8;
  let strokeopacity = options.strokeopacity ? options.strokeopacity : 0.5;
  let strokedasharray = options.strokedasharray ? options.strokedasharray : 2;
  let step = options.step ? options.step : [10, 10];
  step = Array.isArray(step) ? step : [step, step];
  selection
    .append("g")
    .append("path")
    .datum(d3.geoGraticule().step(step))
    .attr("d", d3.geoPath(projection))
    .attr("clip-path", "url(#clip)")
    .style("fill", "none")
    .style("stroke", stroke)
    .style("stroke-width", strokewidth)
    .style("stroke-opacity", strokeopacity)
    .style("stroke-dasharray", strokedasharray);
}

// outline
function plotOutline(selection, projection, options = {}) {
  let fill = options.fill ? options.fill : "#add8f7";
  let stroke = options.stroke ? options.stroke : "none";
  let strokewidth = options.strokewidth ? options.strokewidth : 1;
  selection
    .append("g")
    .append("path")
    .attr("d", d3.geoPath(projection)({ type: "Sphere" }))
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth);
}

// Height
function getHeight(features, projection, width, outline) {
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

module.exports = { plotHeader, plotFooter, plotGraticule, plotOutline, getHeight };
