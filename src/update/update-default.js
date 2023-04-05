import { getattr } from "../helpers/getattr.js";
export function update_default({
  svg,
  id = null,
  selectall = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  console.log(selectall);
  console.log(attr);
  svg
    .select(`g.${id}`)
    .selectAll(selectall)
    .transition()
    .delay(delay)
    .duration(duration)
    .attr(getattr(attr), value)
    .style(getattr(attr), value);
}
