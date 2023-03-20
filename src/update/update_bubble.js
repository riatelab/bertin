import { legcircles } from "../legend/leg-circles.js";
import { scaleSqrt } from "d3-scale";
import { min, max } from "d3-array";
const d3 = Object.assign({}, { min, max, scaleSqrt });

export function update_bubble({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  node
    .selectAll("circle")
    .transition()
    .delay(delay)
    .duration(duration)
    .attr(attr, value)
    .style(attr, value);

  if (attr == "k") {
    let datalayer = JSON.parse(node.attr("data-layer"));
    let radius = d3.scaleSqrt([0, datalayer.valmax], [0, value]);

    node
      .selectAll("circle")
      // .data(data)
      // .join("circle")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));

    // legend

    svg.select(`g.leg_${id}`).remove();

    legcircles(svg, id, {
      x: datalayer.leg_x,
      y: datalayer.leg_y,
      round:
        datalayer.leg_round !== undefined ? datalayer.leg_round : undefined,
      divisor: datalayer.leg_divisor,
      k: value,
      fixmax: datalayer.fixmax,
      stroke: datalayer.leg_stroke,
      fill: datalayer.leg_fill,
      strokeWidth: datalayer.leg_strokeWidth,
      txtcol: datalayer.leg_txtcol,
      title: datalayer.leg_title,
      fontSize: datalayer.leg_fontSize,
      fontSize2: datalayer.leg_fontSize2,
      title: datalayer.leg_title ? datalayer.leg_title : datalayer.values,
      values: datalayer.legval,
    });
  }
}
