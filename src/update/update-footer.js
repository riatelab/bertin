export function update_footer({
  svg,
  id = null,
  attr = null,
  value = null,
  duration = 0,
  delay = 0,
} = {}) {
  if (attr == "text") {
    svg
      .select(`g.${id}`)
      .selectAll("text")
      .transition()
      .delay(delay)
      .duration(duration / 2)
      .attr("opacity", 0)
      .transition()
      .delay(0)
      .duration(duration / 2)
      .text(value)
      .attr("opacity", 1);
  } else {
  }
}
