import { colorize } from "../helpers/colorize.js";
import { legends } from "../legend/legends.js";
import { legsimple } from "../legend/leg-simple.js";
export function update_simple({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  let leg = svg.select(`g.legbox_${id}`);
  let datalayer = JSON.parse(node.attr("data-layer"));

  if (attr == "fill" || attr == "stroke") {
    switch (typeof value) {
      case "string":
        node
          .selectAll("path")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, value);

        leg.remove();
        legsimple(svg, datalayer.leg, id);
        break;
      case "object":
        value =
          typeof datalayer[attr] == "object"
            ? { ...datalayer[attr], ...value }
            : value;

        node
          .selectAll("path")
          .transition()
          .delay(delay)
          .duration(duration)
          .style(attr, (d) =>
            colorize(node.selectAll("path").data(), value).getcol(
              d.properties[value.values]
            )
          );

        datalayer[attr] = value;
        svg.select(`g.${id}`).attr("data-layer", JSON.stringify(datalayer));

        leg.remove();

        legends(
          {
            type: "FeatureCollection",
            features: node.selectAll("path").data(),
          },
          svg,
          value,
          datalayer.stroke,
          datalayer.strokeWidth,
          id,
          delay,
          duration
        );
        break;
    }
  } else {
    node
      .selectAll("path")
      .transition()
      .delay(delay)
      .duration(duration)
      .style(attr, value);
  }
}
