import { thickness } from "./thickness.js";
import { forceX, forceY, forceCollide, forceSimulation } from "d3-force";
const d3 = Object.assign({}, { forceX, forceY, forceCollide, forceSimulation });

export function simulation_circles(
  features,
  values,
  strokewidth,
  radius,
  projection
) {
  return d3
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
          radius(Math.abs(d.properties[values])) +
          thickness(features, strokewidth).getthickness(
            d.properties[strokewidth.values] || 0
          ) /
            2
      )
    );
}
