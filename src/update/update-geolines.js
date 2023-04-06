import { getattr } from "../helpers/getattr.js";
export function update_geolines({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  svg
    .select(`g.${id}`)
    .selectAll("path")
    .transition()
    .delay(delay)
    .duration(duration)
    .attr(getattr(attr), value)
    .style(getattr(attr), value);
}
