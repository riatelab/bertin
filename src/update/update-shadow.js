import { getattr } from "../helpers/getattr.js";

export function update_shadow({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  let datalayer = JSON.parse(node.attr("data-layer"));

  if (attr == "dx") {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("transform", `translate(${value} ${datalayer.dy})`);
  } else if (attr == "dy") {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("transform", `translate(${datalayer.dx} ${value})`);
  } else {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
