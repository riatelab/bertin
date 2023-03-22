import { legcircles } from "../legend/leg-circles.js";
import { scaleSqrt } from "d3-scale";
import { min, max } from "d3-array";
import { thickness } from "../helpers/thickness.js";
import { forceX, forceY, forceCollide, forceSimulation } from "d3-force";
const d3 = Object.assign(
  {},
  { min, max, scaleSqrt, forceX, forceY, forceCollide, forceSimulation }
);

export function update_bubble({
  svg,
  id = null,
  attr = null,
  value = null,
  projection,
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

    // If dorling

    console.log(datalayer.strokeWidth.values);

    if (datalayer.dorling == true) {
      let features = node.selectAll("circle").data();
      const simulation = d3
        .forceSimulation(features)
        .force(
          "x",
          d3.forceX((d) => projection(d.geometry.coordinates)[0])
        )
        .force(
          "y",
          d3.forceY((d) => projection(d.geometry.coordinates)[1])
        )
        .force(
          "collide",
          d3.forceCollide(
            (d) =>
              radius(Math.abs(d.properties[datalayer.values])) +
              thickness(features, datalayer.strokeWidth).getthickness(
                d.properties[datalayer.strokeWidth.values] || 0
              ) /
                2
          )
        );

      for (let i = 0; i < datalayer.iteration; i++) {
        simulation.tick();
      }

      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    } else {
      node
        .selectAll("circle")
        .transition()
        .delay(delay)
        .duration(duration)
        .attr("r", (d) => radius(Math.abs(d.properties[datalayer.values])));
    }

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
