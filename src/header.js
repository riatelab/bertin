// Imports
import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

// header
export function addheader(selection, width, options = {}) {
  let fontsize;
  if (options.text) {
    fontsize = 25;
  }
  if (options.fontsize) {
    fontsize = options.fontsize;
  }
  let text = options.text ? options.text : "";
  let fill = options.fill ? options.fill : "#9e9696";
  let background = options.background ? options.background : "white";
  let backgroundopacity = options.backgroundopacity
    ? options.backgroundopacity
    : 1;
  let anchor = options.anchor ? options.anchor : "middle";

  const delta = fontsize * text.split("\n").length;

  let x;
  if (anchor == "start") {
    x = 5;
  }
  if (anchor == "middle") {
    x = width / 2;
  }
  if (anchor == "end") {
    x = width - 5;
  }

  let header = selection
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "header")
    .attr(":inkscape:label", "header");

  header
    .append("rect")
    .attr("x", 0)
    .attr("y", 0 - delta - 10)
    .attr("width", width)
    .attr("height", delta + 10)
    .attr("fill", background)
    .attr("fill-opacity", backgroundopacity);

  header
    .selectAll("text")
    .data(options.text.split("\n"))
    .join("text")
    .attr("x", x)
    .attr("y", -delta - 5)
    .attr("font-size", `${fontsize}px`)
    .attr("dy", (d, i) => i * fontsize)
    .attr("text-anchor", anchor)
    .attr("alignment-baseline", "hanging")
    .attr("fill", fill)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("fill-opacity", 1)
    .text((d) => d);
}
