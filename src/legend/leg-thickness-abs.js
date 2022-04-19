import * as d3selection from "d3-selection";
import * as d3scale from "d3-scale";
import * as d3array from "d3-array";
import {rounding } from "../helpers/rounding.js";


const d3 = Object.assign({}, d3array, d3scale, d3selection);

export function legthicknessabs(selection, options = {}) {
  let x = options.x ?? null;
  let y = options.y ?? null;
  let valmax = options.valmax;
  let sizemax = options.sizemax;
  let title = options.title ?? null;
  let fontSize = options.fontSize ?? 14;
  let fontSize2 = options.fontSize2 ?? 10;
  let fill = options.fill ?? "none";
  let stroke = options.stroke ?? "black";
  let strokeWidth = options.strokeWidth ?? 0.4;
  let fillOpacity = options.fillOpacity ?? 1;
  let txtcol = options.txtcol ?? "#363636";
  let w = options.w ?? 75;
  let round = options.round ?? undefined;

  const span = 10;

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
      .append("path")
      .attr(
        "d",
        `M ${x},${y + delta + sizemax / 2} ${x + w},${y + delta} ${x + w},${
          y + delta + sizemax
        } Z `
      )
      .attr("stroke", stroke)
      .attr("fill", fill)
      .attr("stroke-width", strokeWidth)
      .attr("fill-opacity", fillOpacity);

    leg
      .append("text")
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "start")
      .attr("dominant-baseline", "hanging")
      .attr("x", x)
      .attr("y", y + delta + sizemax / 2 + fontSize2 / 2)
      .text("0");

    leg
      .append("text")
      .attr("font-size", `${fontSize2}px`)
      .attr("fill", txtcol)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "hanging")
      .attr("x", x + w)
      .attr("y", y + delta + sizemax + fontSize2 / 2)
      .text(rounding(valmax, round));
  }
}
