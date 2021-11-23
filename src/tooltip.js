import * as d3selection from "d3-selection";
const d3 = Object.assign({}, d3selection);

export function addtooltip(g, value){
  if (!value) return g.style("display", "none");

  g.style("display", null)
    .style("pointer-events", "none")
    .style("font", "8px sans-serif");

  const path = g
    .selectAll("path")
    .data([null])
    .join("path")
    .attr("fill", "#fcf7e6")
    .attr("stroke", "#4a4d4b");

  const fontweight = ["bold", "normal", "normal"];
  const fontsize = [18, 14, 10];
  const fontstyle = ["normal", "normal", "italic"];

  const text = g
    .selectAll("text")
    .data([null])
    .join("text")
    .call((text) =>
      text
        .selectAll("tspan")
        .data((value + "").split(/\n/))
        .join("tspan")
        .attr("x", 0)
        .attr("y", (d, i) => `${i * 1.4}em`)
        .style("font-weight", (_, i) => fontweight[i])
        .style("font-size", (_, i) => fontsize[i])
        .style("font-style", (_, i) => fontstyle[i])
        .style("fill", "#4d4545")
        .text((d) => d)
    );

  const { x, y, width: w, height: h } = text.node().getBBox();

  text.attr("transform", `translate(${-w / 2},${15 - y})`);
  path.attr(
    "d",
    `M${-w / 2 - 10},5H-5l5,-5l5,5H${w / 2 + 10}v${h + 20}h-${w + 20}z`
  );
}
