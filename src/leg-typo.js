import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";

const d3 = Object.assign({}, d3array, d3scale, d3selection);

export function legtypo(selection, options = {}) {
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let h = options.h ? options.h : 20;
  let title = options.title ? options.title : null;
  let fontsize = options.fontsize ? options.fontsize : 14;
  let fontsize2 = options.fontsize2 ? options.fontsize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fillopacity = options.fillopacity ? options.fillopacity : 1;
  let strokewidth = options.strokewidth ? options.strokewidth : 0.5;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let types = options.types;
  let colors = options.colors;

  let getcolor = d3.scaleOrdinal().domain(types).range(colors);
  const span = 3;

  // x = 100;
  // y = 100;
  // title = "Title of the legend";

  if (x != null && y != null) {
    let leg = selection.append("g");

    let delta = 0;
    if (title != null) {
      delta = (title.split("\n").length + 1) * fontsize;
      leg
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
    leg
      .selectAll("rect")
      .data(types)
      .join("rect")
      .attr("x", x)
      .attr("y", (d, i) => y + delta + (h + span) * i)
      .attr("height", h)
      .attr("width", w)
      .attr("fill", (d) => getcolor(d))
      .attr("stroke", stroke)
      .attr("stroke-width", strokewidth)
      .attr("fill-opacity", fillopacity);

    leg
      .append("g")
      .selectAll("text")
      .data(types)
      .join("text")
      .attr("x", x + w + fontsize2 / 2)
      .attr("y", y + delta + h / 2)
      //.attr("y", y + h / 2 - (fontsize2 * text.split("\n").length) / 2 + delta)
      .attr("font-size", `${fontsize2}px`)
      .attr("dy", (d, i) => (h + span) * i)
      .attr("text-anchor", "start")
      .attr("alignment-baseline", "central")
      .text((d) => d);
  }
}
