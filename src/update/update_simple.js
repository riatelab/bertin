import { colorize } from "../helpers/colorize.js";
export function update_simple({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  node
    .selectAll("path")
    .transition()
    .delay(delay)
    .duration(duration)
    .style(attr, value);

  if (attr == "fill" && typeof value == "object") {
    console.log("obj");

    let datalayer = JSON.parse(node.attr("data-layer"));
    console.log("before");
    console.log(value);
    value = { ...datalayer.fill, ...value };
    console.log("after");
    console.log(value);
    datalayer.fill = value;
    svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

    console.log(datalayer.fill);
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .style("fill", (d) =>
        colorize(node.selectAll("path").data(), value).getcol(
          d.properties[value.values]
        )
      );
  }
}
