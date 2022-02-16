import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";

const d3 = Object.assign({}, d3array, d3scale, d3selection);

export function legchoro(selection, options = {}) {
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let h = options.h ? options.h : 20;
  let title = options.title ? options.title : null;
  let fontSize = options.fontSize ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let fillOpacity = options.fillOpacity ? options.fillOpacity : 1;
  let strokeWidth = options.strokeWidth ? options.strokeWidth : 0.5;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let breaks = options.breaks;
  let colors = options.colors;

  const span = 0;

  if (x != null && y != null) {
    let leg = selection.append("g");

    let delta = 0;
    if (title != null) {
      delta = (title.split("\n").length + 1) * fontSize;
      leg
        .append("g")
        .selectAll("text")
        .data(title.split("\n"))
        .join("text")
        .attr("x", x)
        .attr("y", y)
        .attr("font-size", `${fontSize}px`)
        .attr("dy", (d, i) => i * fontSize)
        .attr("text-anchor", "start")
        .attr("dominant-baseline", "hanging")
        .attr("fill", txtcol)
        .text((d) => d);
    }
    leg
      .selectAll("rect")
      .data(d3.reverse(colors))
      .join("rect")
      .attr("x", x)
      .attr("y", (d, i) => y + delta + (h + span) * i)
      .attr("height", h)
      .attr("width", w)
      .attr("fill", (d) => d)
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("fill-opacity", fillOpacity);

    leg
      .append("g")
      .selectAll("text")
      .data(d3.reverse(breaks))
      .join("text")
      .attr("x", x + w + fontSize2 / 2)
      .attr("y", y + delta)
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("dy", (d, i) => (h + span) * i)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .text((d) => d);
  }
}
