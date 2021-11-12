// Imports
import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

// Footer
export function addfooter(selection, width, height, options = {}) {
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
    .append("g")
    .attr(":inkscape:groupmode", "layer")
    .attr("id", "footer")
    .attr(":inkscape:label", "footer")
    .append("text")
    .text(options.text)
    .attr("x", width / 2)
    .attr("y", height + fontsize / 2)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", fill)
    .attr("dominant-baseline", "middle")
    .style("font-size", fontsize)
    .attr("fill-opacity", 1);
}
