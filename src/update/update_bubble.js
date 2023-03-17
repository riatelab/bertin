export function update_bubble({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  svg
    .select(`g.${id}`)
    .selectAll("circle")
    .transition()
    .delay(delay)
    .duration(duration)
    .attr(attr, value)
    .style(attr, value);
}
