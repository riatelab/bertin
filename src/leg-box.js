import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
const d3 = Object.assign({}, d3scale, d3selection);

export function legbox = (selection, options = {}) => {

  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let h = options.h ? options.h : 20;
  let title = options.title
    ? options.title
    : `Title, year
(units)`;
  let text = options.text ? options.text : `text of the box`;
  let fontsize = options.fontsize ? options.fontsize : 14;
  let fontsize2 = options.fontsize2 ? options.fontsize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fill = options.fill ? options.fill : "#CCCCCC";
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let strokewidth = options.strokewidth ? options.strokewidth : 1;
  let txtcol = options.txtcol ? options.txtcol : "#363636";

  let delta = 0;
  if (title != null) {
    delta = (title.split("\n").length + 1) * fontsize;
    selection
      .append("g")
      .selectAll("text")
      .data(title.split("\n"))
      .join("text")
      .attr("x", x)
      .attr("y", y)
      .attr("font-size", `${fontsize}px`)
      .attr("dy", (d, i) => i * fontsize)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "hanging")
      .attr("fill", txtcol)
      .text((d) => d);
  }
  selection
    .append("rect")
    .attr("x", x)
    .attr("y", y + delta)
    .attr("height", h)
    .attr("width", w)
    .attr("fill", fill)
    .attr("stroke", stroke)
    .attr("stroke-width", strokewidth)
    .attr("fill-opacity", fillopacity);

  selection
    .append("g")
    .selectAll("text")
    .data(text.split("\n"))
    .join("text")
    .attr("x", x + w + fontsize2 / 2)
    .attr("y", y + h / 2 - (fontsize2 * text.split("\n").length) / 2 + delta)
    .attr("font-size", `${fontsize2}px`)
    .attr("dy", (d, i) => i * fontsize2)
    .attr("text-anchor", "start")
    .attr("alignment-baseline", "hanging")
    .text((d) => d);

  selection
    .append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 4)
    .attr("fill", "red");
}
