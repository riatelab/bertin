import { reverse } from "d3-array";
const d3 = Object.assign({}, { reverse });
import { rounding } from "../helpers/rounding.js";

export function legthicknessdiscr(
  selection,
  options = {},
  delay = 0,
  duration = 0
) {
  let x = options.x ? options.x : null;
  let y = options.y ? options.y : null;
  let w = options.w ? options.w : 30;
  let title = options.title ? options.title : null;
  let fontSize = options.fontSize != undefined ? options.fontSize : 14;
  let fontSize2 = options.fontSize2 != undefined ? options.fontSize2 : 10;
  let stroke = options.stroke ? options.stroke : "black";
  let strokeOpacity =
    options.strokeOpacity != undefined ? options.strokeOpacity : 1;
  let txtcol = options.txtcol ? options.txtcol : "#363636";
  let breaks = options.breaks;
  let sizes = options.sizes;
  let round = options.round !== undefined ? options.round : undefined;

  sizes = d3.reverse(sizes);
  breaks = d3.reverse(breaks);

  if (x != null && y != null) {
    let leg = selection
      .append("g")
      .attr("class", "bertinlegend")
      .attr("class", options.id);

    if (duration != 0) {
      leg
        .attr("opacity", 0)
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("opacity", 1);
    }

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

    const span = 10;

    // y lines
    let y_lines = [];
    let cumul = 0;
    for (let i = 0; i < sizes.length; i++) {
      y_lines.push(y + delta + cumul + sizes[i] / 2 + i * span);
      cumul += sizes[i];
    }

    // y txt
    let y_txt = [];
    cumul = 0;
    for (let i = 0; i < breaks.length; i++) {
      y_txt.push(y + delta + cumul - span / 2);
      cumul += sizes[i] + span;
    }

    leg
      .selectAll("line")
      .data(sizes)
      .join("line")
      .attr("x1", x)
      .attr("y1", (d, i) => y_lines[i])
      .attr("x2", x + w)
      .attr("y2", (d, i) => y_lines[i])
      .attr("stroke", stroke)
      .attr("stroke-opacity", strokeOpacity)
      .attr("stroke-width", (d) => d);

    leg
      .append("g")
      .selectAll("text")
      .data(breaks)
      .join("text")
      .attr("x", x + w + fontSize2 / 2)
      .attr("y", (d, i) => y_txt[i])
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "central")
      .text((d) => rounding(d, round));
  }
}
