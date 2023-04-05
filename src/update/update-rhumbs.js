import { getangle } from "../helpers/getangle.js";
import { getattr } from "../helpers/getattr.js";

export function update_rhumbs({
  svg,
  id = null,
  width,
  height,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  let node = svg.select(`g.${id}`);
  let size = Math.max(width, height);

  if (attr == "nb") {
    let pos = node.selectAll("polyline").nodes()[0].animatedPoints[0];

    node
      .selectAll("polyline")
      .data(getangle(value))
      .join("polyline")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("points", function (d, i) {
        let x2 = pos.x + Math.cos(d) * size;
        let y2 = pos.y + Math.sin(d) * size;
        return pos.x + "," + pos.y + " " + x2 + "," + y2;
      });
  } else if (attr == "position") {
    node
      .selectAll("polyline")
      .data(getangle(node.selectAll("polyline").size()))
      .join("polyline")
      .transition()
      .delay(delay)
      .duration(duration)
      .attr("points", function (d, i) {
        let x2 = value[0] + Math.cos(d) * size;
        let y2 = value[1] + Math.sin(d) * size;
        return value[0] + "," + value[1] + " " + x2 + "," + y2;
      });
  } else {
    node
      .transition()
      .delay(delay)
      .duration(duration)
      .attr(getattr(attr), value)
      .style(getattr(attr), value);
  }
}
