// Imports
import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

// header
export function addheader(selection, width, options = {}) {
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
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "header")
    .attr(":inkscape:label", "header")
    .append("text")
    .text(options.text)
    .attr("x", width / 2)
    .attr("y", -fontsize / 2)
    .attr("font-family", "sans-serif")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .attr("fill", fill)
    .attr("dominant-baseline", "middle")
    .style("font-size", options.fontsize)
    .attr("fill-opacity", 1);
}
