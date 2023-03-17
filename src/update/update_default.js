export function update_default({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  svg
    .select(`g.${id}`)
    .transition()
    .delay(delay)
    .duration(duration)
    .attr(attr, value)
    .style(attr, value);
}
